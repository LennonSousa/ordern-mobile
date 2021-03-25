import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';
import stripeapi from '../../services/stripeapi';
import stripeErrorCodes from '../../utils/stripeErrorCodes';

import { CustomerContext } from '../../context/customerContext';
import { OrdersContext } from '../../context/ordersContext';
import { ContextOrdering } from '../../context/orderingContext';

import { PaymentDelivery } from '../../components/PaymentsDelivery';
import { PaymentStripe } from '../../components/PaymentStripe';
import { CustomerPayment } from '../../components/CustomerPayments';
import { CrediBrand } from '../../components/CreditBrands';
import { DebitBrand } from '../../components/DebitBrands';
import Input from '../../components/Interfaces/Inputs';
import InvalidFeedback from '../../components/Interfaces/InvalidFeedback';
import WaitingModal, { statusModal } from '../../components/Interfaces/WaitingModal';

import globalStyles, { colorPrimaryLight, colorPrimaryDark, colorBackground, colorTextDescription } from '../../assets/styles/global';
import PageFooter from '../../components/PageFooter';

interface Card {
    [key: string]: string;
}

interface CardBrands {
    name: string;
    code: string;
}

let paymentType: "money" | "credit" | "debit" | "on-line";

const validatiionSchema = Yup.object().shape({
    cvc: Yup.number().required('Obrigatório!'),
});

const changeValidatiionSchema = Yup.object().shape({
    changeValue: Yup.number().positive('Digite um valor.').notRequired(),
});

export default function Payment() {
    const navigation = useNavigation();
    const { customer } = useContext(CustomerContext);
    const { handleOrders } = useContext(OrdersContext);
    const { order, handleClearOrder } = useContext(ContextOrdering);

    const [selectedCard, setSelectedCard] = useState<CustomerPayment>();
    const [selectedPaymentType, setSelectedPaymentType] = useState<typeof paymentType>('money');

    const [cardBrandsModal, setCardBrandsModal] = useState(false);

    const [paymentsDelivery, setPaymentsDelivery] = useState<PaymentDelivery[]>([]);
    const [paymentStripe, setPaymentStripe] = useState<PaymentStripe>();
    const [creditBrands, setCreditBrands] = useState<CrediBrand[]>([]);
    const [debitBrands, setDebitBrands] = useState<DebitBrand[]>([]);

    const [cardBrands, setCardBrands] = useState<CardBrands[]>([]);
    const [selectedCardBrand, setSelectedCardBrand] = useState("");

    const [modalWaiting, setModalWaiting] = useState<typeof statusModal>("hidden");
    const [errorMessage, setErrorMessage] = useState('');

    const [changeAskModalWaiting, setChangeAskModalWaiting] = useState(false);

    useEffect(() => {
        if (customer) {
            api.get('payments/delivery').then(res => {
                setPaymentsDelivery(res.data);
            }).catch(() => {
                console.log("Error get payments delivery.");
            });

            api.get('payments/stripe').then(res => {
                if (res.status === 200)
                    setPaymentStripe(res.data);
            }).catch(() => {
                console.log("Error get payment stripe.");
            });

            api.get('payments/credit-brands').then(res => {
                setCreditBrands(res.data);
            }).catch(() => {
                console.log("Error get credit brands.");
            });

            api.get('payments/debit-brands').then(res => {
                setDebitBrands(res.data);
            }).catch(() => {
                console.log("Error get debit brands.");
            });
        }
    }, [customer]);

    useEffect(() => {
        if (selectedPaymentType === "credit")
            setCardBrands(creditBrands);
        else if (selectedPaymentType === "debit")
            setCardBrands(debitBrands);
    }, [selectedPaymentType]);

    async function requestPayment(card: Card) {
        if (customer && order) {
            setModalWaiting("waiting");

            try {
                const creditCardToken = await getCreditCardToken(card);

                if (creditCardToken) {
                    const orderTotal = order.total.toFixed(2).replace('.', '').replace(',', '');

                    if (creditCardToken.status === 200) {
                        const paymentResponse = await api.post('payments/dopayments', {
                            "amount": orderTotal,
                            "tokenId": creditCardToken.data.id,
                            "description": `Pedido: ${order.tracker}`,
                            "email": customer.email
                        },
                            {
                                validateStatus: function (status) {
                                    return status < 500; // Resolve only if the status code is less than 500
                                }
                            });

                        if (paymentResponse.status === 200) {
                            let itemsToOrder = order.orderItems.map(item => {
                                return {
                                    amount: item.amount,
                                    name: item.name,
                                    value: item.value,
                                    notes: item.notes,
                                    orderItemAdditionals: item.orderItemAdditionals.map(additional => {
                                        return {
                                            amount: additional.amount,
                                            name: additional.name,
                                            value: additional.value,
                                        }
                                    })
                                };
                            });

                            const res = await api.post('orders', {
                                tracker: order.tracker,
                                client_id: customer.id,
                                client: customer.name,
                                delivery_in: new Date,
                                sub_total: order.sub_total,
                                cupom: order.cupom,
                                delivery_tax: order.delivery_tax,
                                delivery_type: order.delivery_type,
                                discount: order.discount,
                                fee: order.fee,
                                total: order.total,
                                payment: `****${selectedCard?.card_number.slice(selectedCard.card_number.length - 4)} - ${selectedCard?.brand}`,
                                payment_type: selectedPaymentType,
                                paid: true,
                                address: order.address,
                                reason_cancellation: "",
                                orderStatus: 1,
                                orderItems: itemsToOrder
                            });

                            const orders = await api.get(`customer/orders/${customer.id}`);

                            handleOrders(orders.data);

                            setModalWaiting("order-confirmed");

                            setTimeout(() => {
                                setModalWaiting("hidden");
                                handleClearOrder();

                                navigation.reset({
                                    index: 0,
                                    routeNames: [
                                        "HomeTabs",
                                        "ProductDetails",
                                        "Search",
                                        "CategoryAdditionals",
                                        "CustomerNew",
                                        "CreateCustomer",
                                        "CustomerNewReset",
                                        "CustomerReset",
                                        "CustomerUpdate",
                                        "AddressCustomer",
                                        "PaymentsCustomer",
                                        "Shipment",
                                        "PickupShipment",
                                        "OrderReview",
                                        "Payment",
                                        "OrderDetails",
                                        "PrivacyTerms",
                                        "About",
                                    ],
                                    routes: [
                                        {
                                            name: 'HomeTabs',
                                            state: {
                                                routeNames: [
                                                    "LandingPage",
                                                    "Cart",
                                                    "OrdersList",
                                                    "Profile",
                                                ],
                                                routes: [
                                                    { name: "LandingPage" },
                                                    { name: "Cart" },
                                                    { name: "OrdersList" },
                                                    { name: "Profile" },
                                                ],
                                                type: 'tab'
                                            },
                                        },
                                        { name: 'OrderDetails', params: { id: res.data.id } },
                                    ],
                                    type: 'stack'
                                });
                            }, 2000);
                        }
                        else {
                            setModalWaiting("error");
                            setErrorMessage(stripeErrorCodes(paymentResponse.data.code));

                            console.log('stripe error code: ', stripeErrorCodes(paymentResponse.data.code));

                            console.log('Payment failed');
                        }
                    }
                    else {
                        setModalWaiting("error");

                        setErrorMessage(stripeErrorCodes(creditCardToken.data.error.code));

                        console.log('Token card error');
                    }
                }
                else {
                    setModalWaiting("error");

                    setErrorMessage('Erro na transação. Pagamento on-line não disponível no momento.');

                    console.log('Payment failed');
                }
            }
            catch {
                setModalWaiting("error");

                setErrorMessage('Erro na transação. Tente novamente mais tarde.');

                console.log('Payment failed');
            }
        }
    }

    const getCreditCardToken = async (creditCardData: Card) => {
        if (paymentStripe) {
            const response = await stripeapi.post('tokens',
                Object.keys(creditCardData)
                    .map(key => key + '=' + creditCardData[key])
                    .join('&'),
                {
                    validateStatus: function (status) {
                        return status < 500; // Resolve only if the status code is less than 500
                    },
                    headers: { 'Authorization': `Bearer ${paymentStripe.pk_live}` }
                }
            );

            return response;
        }
        else
            return null;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={globalStyles.container}>
                <View style={globalStyles.row}>
                    <View style={globalStyles.column}>
                        <View style={globalStyles.menuRow}>
                            <View style={globalStyles.menuColumn}>
                                <Text style={globalStyles.textDescription}>Escolha uma forma de pagamento ou adicione uma nova.</Text>
                            </View>
                            <View style={globalStyles.menuIconColumn}>
                                <TouchableHighlight
                                    style={styles.buttonNewItem}
                                    underlayColor="#e8e8e8"
                                    onPress={() => {
                                        navigation.navigate('PaymentsCustomer');
                                    }}
                                >
                                    <View>
                                        <Feather name="plus" size={24} color="#cc0000" />
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>

                {
                    paymentsDelivery.find(item => { return item.code === 'money' && item.active === true }) && <View style={globalStyles.containerItem}>
                        <BorderlessButton onPress={() => { setSelectedCard(undefined); setSelectedPaymentType('money'); }}>
                            <View style={globalStyles.row}>
                                <View style={globalStyles.column}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.colTitleButtonItem}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 0.1, marginHorizontal: 10 }}>
                                                    <FontAwesome5 name="money-bill" size={18} color="#8c8c8c" />
                                                </View>
                                                <View style={globalStyles.colTitleButtonItem}>
                                                    <Text style={globalStyles.textsButtonBorderMenu}>Dinheiro</Text>
                                                </View>
                                                <View style={globalStyles.colIconButtonItem}>
                                                    {
                                                        !selectedCard && selectedPaymentType === 'money' && <FontAwesome5 name="check" size={18} color={colorPrimaryLight} />
                                                    }
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            </View>
                        </BorderlessButton>
                    </View>
                }

                {
                    paymentsDelivery.find(item => { return item.code === 'debit' && item.active === true }) && <View style={globalStyles.containerItem}>
                        <BorderlessButton
                            onPress={() => {
                                setSelectedCard(undefined);
                                setSelectedPaymentType('debit');
                                setCardBrandsModal(true);
                            }}
                        >
                            <View style={globalStyles.row}>
                                <View style={globalStyles.column}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.colTitleButtonItem}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 0.1, marginHorizontal: 10 }}>
                                                    <FontAwesome5 name="money-check-alt" size={18} color="#8c8c8c" />
                                                </View>
                                                <View style={globalStyles.colTitleButtonItem}>
                                                    <Text style={globalStyles.textsButtonBorderMenu}>Débito na entrega</Text>
                                                </View>
                                                <View style={globalStyles.colIconButtonItem}>
                                                    {
                                                        !selectedCard && selectedPaymentType === 'debit' && <FontAwesome5 name="check" size={18} color={colorPrimaryLight} />
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </BorderlessButton>
                    </View>
                }

                {
                    paymentsDelivery.find(item => { return item.code === 'credit' && item.active === true }) && <View style={globalStyles.containerItem}>
                        <BorderlessButton
                            onPress={() => {
                                setSelectedCard(undefined);
                                setSelectedPaymentType('credit');
                                setCardBrandsModal(true);
                            }}
                        >
                            <View style={globalStyles.row}>
                                <View style={globalStyles.column}>
                                    <View style={globalStyles.menuRow}>
                                        <View style={globalStyles.colTitleButtonItem}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 0.1, marginHorizontal: 10 }}>
                                                    <FontAwesome5 name="money-check-alt" size={18} color="#8c8c8c" />
                                                </View>
                                                <View style={globalStyles.colTitleButtonItem}>
                                                    <Text style={globalStyles.textsButtonBorderMenu}>Crédito na entrega</Text>
                                                </View>
                                                <View style={globalStyles.colIconButtonItem}>
                                                    {
                                                        !selectedCard && selectedPaymentType === 'credit' && <FontAwesome5 name="check" size={18} color={colorPrimaryLight} />
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </BorderlessButton>
                    </View>
                }

                {
                    paymentStripe && paymentStripe.active && customer ? customer.payment.map((payment, index) => {
                        return <View key={index} style={globalStyles.containerItem}>
                            <BorderlessButton onPress={() => { setSelectedCard(payment); setSelectedPaymentType("on-line"); }}>
                                <View style={globalStyles.row}>
                                    <View style={globalStyles.column}>
                                        <View style={globalStyles.menuRow}>
                                            <View style={globalStyles.colTitleButtonItem}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={globalStyles.colTitleButtonItem}>
                                                        <Text style={{ color: '#8c8c8c' }}>{`****${payment.card_number} - ${payment.brand}`}</Text>
                                                    </View>
                                                    <View style={globalStyles.colIconButtonItem}>
                                                        {
                                                            selectedCard && selectedCard.id === payment.id && <FontAwesome5 name="check" size={18} color={colorPrimaryLight} />
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </BorderlessButton>
                        </View>
                    }) :
                        <View style={globalStyles.row}>
                            <View style={globalStyles.column}>
                                <View style={globalStyles.menuRow}>
                                    <View style={globalStyles.menuColumn}>
                                        <Text style={globalStyles.textDescription}>Pagamento on-line não disponível.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                }

                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <WaitingModal message={errorMessage} status={modalWaiting} />
                </View>
            </ScrollView>

            { /*Modal choose card brand*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={cardBrandsModal}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={styles.modalView}>
                        <View style={{ marginVertical: 5 }}>
                            <FontAwesome5 name="credit-card" size={48} color="#fe3807" />
                        </View>

                        <View>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={[globalStyles.subTitlePrimary, { textAlign: 'center' }]}>Escolha a bandeira</Text>
                            </View>

                            {
                                cardBrands.map((cardBrand, index) => {
                                    return <View key={index} style={styles.containerCardBrands}>
                                        <TouchableOpacity onPress={() => { setSelectedCardBrand(cardBrand.name); setCardBrandsModal(false); }}>
                                            <View style={globalStyles.row}>
                                                <View style={globalStyles.column}>
                                                    <View style={globalStyles.menuRow}>
                                                        <View style={globalStyles.colTitleButtonItem}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={globalStyles.colTitleButtonItem}>
                                                                    <Text style={globalStyles.textsButtonBorderMenu}>{cardBrand.name}</Text>
                                                                </View>
                                                                <View style={globalStyles.colIconButtonItem}>
                                                                    {
                                                                        selectedCardBrand === cardBrand.name && <FontAwesome5 name="check" size={18} color={colorPrimaryLight} />
                                                                    }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                })
                            }

                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <View style={{ flex: 1 }}>
                                    <TouchableHighlight
                                        underlayColor={colorPrimaryDark}
                                        style={globalStyles.footerButton}
                                        onPress={() => { setCardBrandsModal(false) }}
                                    >
                                        <Text style={globalStyles.footerButtonText}>Cancelar</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            { /*Card cvc on-line*/}
            {
                selectedCard ? <Formik
                    initialValues={
                        {
                            cvc: ''
                        }
                    }
                    onSubmit={async values => {
                        try {
                            if (selectedCard && selectedPaymentType === "on-line") {
                                const customerPaymentRes = await api.get(`customer/payment/${selectedCard.id}`);

                                requestPayment({
                                    'card[number]': customerPaymentRes.data.card_number,
                                    'card[exp_month]': selectedCard.exp_month.substring(0, 2),
                                    'card[exp_year]': selectedCard.exp_year.substring(2, 4),
                                    'card[cvc]': values.cvc,
                                    'card[name]': selectedCard.name
                                });
                            }
                        }
                        catch (err) {
                            setModalWaiting("error");

                            setErrorMessage('Erro na transação. Tente novamente mais tarde.');

                            console.log('Error get customr payment: ', err);
                        }
                    }}
                    validationSchema={validatiionSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: 100,
                                backgroundColor: colorBackground,
                                paddingHorizontal: 15,
                                paddingBottom: 15,
                                shadowColor: "#000000",
                                shadowOffset: {
                                    width: 5,
                                    height: 0
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 10
                            }}>
                                <View style={{ flex: 0.5 }}>
                                    <Input
                                        style={styles.fieldsLogIn}
                                        title='Código de segurança'
                                        keyboardType='number-pad'
                                        onChangeText={handleChange('cvc')}
                                        onBlur={handleBlur('cvc')}
                                        value={values.cvc}
                                    />
                                    <InvalidFeedback message={errors.cvc}></InvalidFeedback>
                                </View>
                            </View>

                            <PageFooter>
                                <View style={{ flex: 0.5 }} >
                                    <Text style={[globalStyles.textsMenu, { textAlign: 'center' }]}>{`Total: R$ ${order?.total.toFixed(2).replace('.', ',')}`}</Text>
                                </View>

                                <View style={{ flex: 0.5 }} >
                                    <TouchableHighlight
                                        underlayColor={colorPrimaryDark}
                                        style={globalStyles.footerButton}
                                        onPress={handleSubmit as any}
                                    >
                                        <Text style={globalStyles.footerButtonText}>Pagar</Text>
                                    </TouchableHighlight>
                                </View>
                            </PageFooter>
                        </>
                    )}
                </Formik> :
                    <Formik
                        initialValues={{
                            change: false,
                            changeValue: '',
                        }}
                        onSubmit={async values => {
                            setChangeAskModalWaiting(false);
                            try {
                                if (order && customer) {
                                    let paymentText = '';

                                    if (selectedPaymentType === "credit") {
                                        if (selectedCardBrand !== "")
                                            paymentText = `Crédito na entrega (${selectedCardBrand}).`;
                                        else {
                                            setCardBrandsModal(true);
                                            return;
                                        }
                                    }
                                    else if (selectedPaymentType === "debit") {
                                        if (selectedCardBrand !== "")
                                            paymentText = `Débito na entrega (${selectedCardBrand}).`;
                                        else {
                                            setCardBrandsModal(true);
                                            return;
                                        }
                                    }
                                    else if (selectedPaymentType === "money") {
                                        paymentText = `Dinheiro ${values.change ? `(Troco para R$ ${values.changeValue})` : ''}`
                                    }

                                    setModalWaiting("waiting");

                                    let itemsToOrder = order.orderItems.map(item => {
                                        return {
                                            amount: item.amount,
                                            name: item.name,
                                            value: item.value,
                                            notes: item.notes,
                                            orderItemAdditionals: item.orderItemAdditionals.map(additional => {
                                                return {
                                                    amount: additional.amount,
                                                    name: additional.name,
                                                    value: additional.value,
                                                }
                                            })
                                        };
                                    });

                                    const res = await api.post('orders', {
                                        tracker: order.tracker,
                                        client_id: customer.id,
                                        client: customer.name,
                                        delivery_in: new Date,
                                        sub_total: order.sub_total,
                                        cupom: order.cupom,
                                        delivery_tax: order.delivery_tax,
                                        delivery_type: order.delivery_type,
                                        discount: order.discount,
                                        fee: order.fee,
                                        total: order.total,
                                        payment: paymentText,
                                        payment_type: selectedPaymentType,
                                        paid: false,
                                        address: order.address,
                                        reason_cancellation: "",
                                        orderStatus: 1,
                                        orderItems: itemsToOrder
                                    });

                                    const orders = await api.get(`customer/orders/${customer.id}`);

                                    handleOrders(orders.data);

                                    setModalWaiting("order-confirmed");

                                    setTimeout(() => {
                                        setModalWaiting("hidden");
                                        handleClearOrder();

                                        navigation.reset({
                                            index: 0,
                                            routeNames: [
                                                "HomeTabs",
                                                "ProductDetails",
                                                "Search",
                                                "CategoryAdditionals",
                                                "CustomerNew",
                                                "CreateCustomer",
                                                "CustomerNewReset",
                                                "CustomerReset",
                                                "CustomerUpdate",
                                                "AddressCustomer",
                                                "PaymentsCustomer",
                                                "Shipment",
                                                "PickupShipment",
                                                "OrderReview",
                                                "Payment",
                                                "OrderDetails",
                                                "PrivacyTerms",
                                                "About",
                                            ],
                                            routes: [
                                                {
                                                    name: 'HomeTabs',
                                                    state: {
                                                        routeNames: [
                                                            "LandingPage",
                                                            "Cart",
                                                            "OrdersList",
                                                            "Profile",
                                                        ],
                                                        routes: [
                                                            { name: "LandingPage" },
                                                            { name: "Cart" },
                                                            { name: "OrdersList" },
                                                            { name: "Profile" },
                                                        ],
                                                        type: 'tab'
                                                    },
                                                },
                                                { name: 'OrderDetails', params: { id: res.data.id } },
                                            ],
                                            type: 'stack'
                                        });
                                    }, 2000);
                                }
                            }
                            catch {
                                setModalWaiting("error");

                                setErrorMessage('Erro na transação. Tente novamente mais tarde.');

                                console.log('Order failed');
                            }
                        }}
                        validationSchema={changeValidatiionSchema}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
                            <>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={changeAskModalWaiting}
                                >
                                    <View style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <View style={styles.modalView}>
                                            <View style={{ marginVertical: 5 }}>
                                                <FontAwesome5 name="money-bill-alt" size={48} color="#fe3807" />
                                            </View>

                                            <View>
                                                <View style={{ marginVertical: 5 }}>
                                                    <Text style={[globalStyles.subTitlePrimary, { textAlign: 'center' }]}>Precisa de troco?</Text>
                                                </View>

                                                {
                                                    values.change && <View style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Input
                                                                style={styles.fieldsLogIn}
                                                                title='Valor'
                                                                keyboardType='numeric'
                                                                onChangeText={handleChange('changeValue')}
                                                                onBlur={handleBlur('changeValue')}
                                                                value={values.changeValue}
                                                            />
                                                            <InvalidFeedback message={errors.changeValue}></InvalidFeedback>
                                                        </View>
                                                    </View>
                                                }

                                                <View style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}>
                                                    {
                                                        values.change ? <>
                                                            <View style={{ flex: 0.5, marginHorizontal: 2 }}>
                                                                <TouchableHighlight
                                                                    underlayColor={colorPrimaryDark}
                                                                    style={globalStyles.footerButton}
                                                                    onPress={() => {
                                                                        setFieldValue('change', false)
                                                                    }}
                                                                >
                                                                    <Text style={globalStyles.footerButtonText}>Voltar</Text>
                                                                </TouchableHighlight>
                                                            </View>
                                                            <View style={{ flex: 0.5, marginHorizontal: 2 }}>
                                                                <TouchableHighlight
                                                                    underlayColor={colorPrimaryDark}
                                                                    style={globalStyles.footerButton}
                                                                    onPress={() => {
                                                                        setFieldValue('change', true);
                                                                        handleSubmit() as any;
                                                                    }}
                                                                >
                                                                    <Text style={globalStyles.footerButtonText}>Fazer o pedido</Text>
                                                                </TouchableHighlight>
                                                            </View>
                                                        </> : <>
                                                            <View style={{ flex: 0.5, marginHorizontal: 2 }}>
                                                                <TouchableHighlight
                                                                    underlayColor={colorPrimaryDark}
                                                                    style={globalStyles.footerButton}
                                                                    onPress={() => {
                                                                        setFieldValue('change', false);
                                                                        handleSubmit() as any;
                                                                    }}
                                                                >
                                                                    <Text style={globalStyles.footerButtonText}>Não</Text>
                                                                </TouchableHighlight>
                                                            </View>
                                                            <View style={{ flex: 0.5, marginHorizontal: 2 }}>
                                                                <TouchableHighlight
                                                                    underlayColor={colorPrimaryDark}
                                                                    style={globalStyles.footerButton}
                                                                    onPress={() => {
                                                                        setFieldValue('change', true);
                                                                    }}
                                                                >
                                                                    <Text style={globalStyles.footerButtonText}>Sim</Text>
                                                                </TouchableHighlight>
                                                            </View>
                                                        </>
                                                    }
                                                </View>

                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <TouchableHighlight
                                                            underlayColor={colorPrimaryDark}
                                                            style={globalStyles.footerButton}
                                                            onPress={() => {
                                                                setChangeAskModalWaiting(false);
                                                            }}
                                                        >
                                                            <Text style={globalStyles.footerButtonText}>Cancelar</Text>
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>

                                <PageFooter>
                                    <View style={{ flex: 0.5 }} >
                                        <Text style={[globalStyles.textsMenu, { textAlign: 'center' }]}>{`Total: R$ ${order?.total.toFixed(2).replace('.', ',')}`}</Text>
                                    </View>

                                    {
                                        selectedPaymentType === "money" ? <View style={{ flex: 0.5 }} >
                                            <TouchableHighlight
                                                underlayColor={colorPrimaryDark}
                                                style={globalStyles.footerButton}
                                                onPress={() => setChangeAskModalWaiting(true)}
                                            >
                                                <Text style={globalStyles.footerButtonText}>Fazer o pedido</Text>
                                            </TouchableHighlight>
                                        </View> :
                                            <View style={{ flex: 0.5 }} >
                                                <TouchableHighlight
                                                    underlayColor={colorPrimaryDark}
                                                    style={globalStyles.footerButton}
                                                    onPress={handleSubmit as any}
                                                >
                                                    <Text style={globalStyles.footerButtonText}>Fazer o pedido</Text>
                                                </TouchableHighlight>
                                            </View>
                                    }
                                </PageFooter>
                            </>
                        )}
                    </Formik>

            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonNewItem: {
        padding: 10,
        borderRadius: 5,
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },

    buttonAction: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#cc0000',
        alignItems: 'center',
    },

    buttonConfirm: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffcc00',
        alignItems: 'center',
    },

    fieldsLogIn: {
        marginVertical: 8,
    },

    containerCardBrands: {
        marginVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderColor: colorTextDescription,
        borderWidth: 1,
    },
});