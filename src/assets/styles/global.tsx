import { StyleSheet } from 'react-native';

export const colorBackground = '#FFFFFF';
export const colorPrimaryLight = '#fe3807';
export const colorPrimaryDark = '#cc0000';
export const colorSecondary = '#cccccc';
export const colorSecondaryDark = '#8c8c8c';
export const colorTitlePrimary = '#fe3807';
export const colorTitleSecondary = '#262626';
export const colorSubTitlePrimary = '#595959';
export const colorTextDescription = '#8c8c8c';
export const colorTextInPrimary = '#262626';
export const colorTextInSecondary = '#808080';
export const colorTextMenu = '#262626';
export const colorTextMenuDescription = '#8c8c8c';
export const colorTextBase = '#6A6180';
export const colorInputText = '#4d4d4d';
export const colorDisabledInputText = '#a6a6a6';
export const colorBorder = '#d9d9d9';
export const colorDisabledBorder = '#f2f2f2';
export const colorInputBackground = '#FFF';
export const colorDisabledInputBackground = '#8c8c8c';
export const colorButtonBackground = '#fe3807';
export const colorButtonConfirmBackground = '#ffcc00';
export const colorDisabledButtonBackground = '#8c8c8c';
export const colorButtonText = '#FFFFFF';
export const colorBoxBase = '#FFFFFF';
export const colorBoxBooter = '#FAFAFC';
export const colorHighLight = '#00b300';
export const colorHeaderBackground = '#f9fafc';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorBackground,
        paddingHorizontal: 10
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },

    column: {
        flex: 1,
    },

    divider: {
        borderTopColor: colorBorder,
        borderTopWidth: 1,
        marginHorizontal: 15,
        marginVertical: 15
    },

    fieldsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },

    fieldsColumn: {
        flex: 1,
    },

    containerMenu: {
        paddingHorizontal: 15,
    },

    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    menuColumn: {
        flex: 0.8,
    },

    menuIconColumn: {
        flex: 0.2,
        alignItems: 'flex-end',
    },

    categoryTitle: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: colorPrimaryLight,
    },

    titlePrimaryLight: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: colorPrimaryLight
    },

    titlePrimaryDark: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: colorPrimaryDark
    },

    titleSecondary: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: colorSubTitlePrimary
    },

    subTitlePrimary: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 18,
        color: '#8c8c8c',
    },

    textDescription: {
        fontFamily: 'Nunito_300Light',
        fontSize: 14,
        color: colorTextDescription
    },

    textsMenu: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
        color: colorTextMenu
    },

    textsDescriptionMenu: {
        fontFamily: 'Nunito_300Light',
        fontSize: 14,
        color: colorTextMenuDescription
    },

    textsButtonBorderMenu: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 14,
        color: colorTextMenuDescription
    },

    menuDescriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    menuDescriptionColumn: {
        flex: 1,
    },

    buttonNewItem: {
        padding: 10,
        borderRadius: 5,
    },

    containerItem: {
        flex: 1,
        marginVertical: 5,
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#f2f2f2',
        borderWidth: 1,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3
    },

    colTitleButtonItem: {
        flex: 0.9,
    },

    colIconButtonItem: {
        flex: 0.1,
    },

    fieldsLogIn: {
        marginVertical: 8,
    },

    buttonLogIn: {
        backgroundColor: colorButtonBackground,
        borderRadius: 5,
        marginVertical: 15,
        height: 50,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
    },

    buttonConfirm: {
        backgroundColor: colorButtonConfirmBackground,
        borderRadius: 5,
        marginVertical: 15,
        height: 50,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
    },

    disabledButtonLogIn: {
        backgroundColor: colorDisabledButtonBackground,
        borderRadius: 5,
        marginVertical: 15,
        height: 50,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
    },

    buttonTextLogIn: {
        color: '#ffffff',
        alignSelf: 'center',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
    },

    buttonTextSignIn: {
        color: '#fe3807',
        alignSelf: 'center',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
    },

    footerButton: {
        backgroundColor: colorButtonBackground,
        borderRadius: 5,
        marginVertical: 15,
        height: 50,
        justifyContent: 'center'
    },

    footerButtonText: {
        color: '#ffffff',
        alignSelf: 'center',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
    },
});

export default globalStyles;