import React from 'react';
import { useRoute } from '@react-navigation/native';

import Header from '../../components/PageHeader';
import LegalTexts from '../../components/LegalTexts';

interface PrivacyTermsRouteParams {
    type: "privacy" | "terms";
}

export default function PrivacyTerms() {
    const route = useRoute();

    const params = route.params as PrivacyTermsRouteParams;

    return (
        <>
            <Header title={params.type === "terms" ? "Termos" : "Privacidade"} />

            <LegalTexts type={params.type} />
        </>
    )
}