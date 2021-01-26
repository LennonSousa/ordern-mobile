import React from 'react';
import { WebView } from 'react-native-webview';

interface LegalTextProps {
    type: "privacy" | "terms";
}

export default function LegalTexts({ type }: LegalTextProps) {
    const uriPrivacy = "https://api.casadecarnesisrael.com.br/uploads/privacy.html";
    const uriTerms = "https://api.casadecarnesisrael.com.br/uploads/terms.html";

    return (
        <WebView source={{ uri: type === "privacy" ? uriPrivacy : uriTerms }} />
    )
}