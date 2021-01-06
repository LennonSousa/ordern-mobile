interface Codes {
    [code: string]: string;
}

const codesMessages: Codes = {
    'authentication_required': 'Seu cartão foi rejeitado. A transação requer autenticação.',
    'incorrect_number': 'O número do cartão está incorreto.',
    'invalid_number': 'O número do cartão não é um número válido de cartão de crédito.',
    'invalid_expiry_month': 'O mês de validade do cartão não é válido.',
    'invalid_expiry_year': 'O ano de validade do cartão não é válido.',
    'invalid_cvc': 'O código de segurança do cartão não é válido.',
    'expired_card': 'O cartão expirou.',
    'incorrect_cvc': 'O código de segurança do cartão está incorreto.',
    'incorrect_zip': 'O CEP do cartão falhou a validação.',
    'card_declined': 'O cartão foi recusado.',
    'missing': 'Não existe qualquer cartão em um cliente que está sendo cobrado.',
    'processing_error': 'Ocorreu um erro durante o processamento do cartão.',
    'rate_limit': 'Ocorreu um erro devido a pedidos que atingem a API muito rapidamente. Por favor, nos avise se você está constantemente recebendo esse erro.',
    'balance_insufficient': 'A transferência ou pagamento não pode ser completada por que a conta associada não tem fundos suficientes.',
    'country_unsupported': 'País não suportado.',
    'email_invalid': 'E-mails inválido.',
    'instant_payouts_unsupported': 'Este cartão não é elegível para Pagamentos Instantâneos. Tente um cartão de débito de outro banco.',
    'invalid_card_type': 'O cartão fornecido não é suportado para pagamentos. Providencie um cartão de débito não pré-pago.',
    'invalid_characters': 'Você forneceu caracteres inválidos quando preencheu o cartão.'
}

export default function stripeErrorCodes(code: string) {
    let errorMessage = 'Erro desconhecido.'

    Object.keys(codesMessages).map(item => {
        if (item.toString() === code) {
            errorMessage = codesMessages[item];
        }
    });

    return errorMessage;
}