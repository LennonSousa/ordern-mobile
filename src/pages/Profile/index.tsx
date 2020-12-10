import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, TextInput } from 'react-native';

import { ClientContext } from '../../context/clientContext';
import Header from '../../components/PageHeader';

export default function Profile() {
    const { client } = useContext(ClientContext);
    return (
        <View style={styles.container}>
            <Header title="Perfil" showCancel={false} />
            {
                client ? <View>
                    <Text>Logado</Text>
                </View> :
                    <View>
                        <View style={styles.fieldsRow}>
                            <Text style={{flex: 1}}>Entrar</Text>
                        </View>

                        <View style={styles.fieldsRow}>
                            <TextInput placeholder='E-mail' textContentType='emailAddress' />
                        </View>

                        <View style={styles.fieldsRow}>
                            <TextInput placeholder='Senha' textContentType='password' secureTextEntry={true} />
                        </View>

                        <View style={styles.fieldsRow}>
                            <TouchableHighlight>
                                <Text>Entrar</Text>
                            </TouchableHighlight>
                        </View>




                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    fieldsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    }
});