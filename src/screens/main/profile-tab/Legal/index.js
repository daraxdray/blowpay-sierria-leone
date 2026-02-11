import React from 'react';
import {View, ScrollView, Platform} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import LegalSection from '../../../../components/profile/LegalSection';
import AppConstant from '../../../../constants/data/appConstant';

const Legal = props => {
  const navigation = props.navigation;
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Legal"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>
      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.view1}>
          <LegalSection
            title="1. Information We Collect"
            content="Personal information is collected and stored through licensed third-party service providers to provide and improve our services. The types of information that may be collected include: Account Details, Payment Information, Identity Verification, Transaction Information, Device Information, Cookies & Tracking Technologies, Location Information."
          />
          <LegalSection
            title="2. How We Use Your Information"
            content="Information is used by us and our licensed third-party providers to: Provide and maintain our services, Process transactions and handle payments, Improve the functionality and user experience of our platform, Personalize services based on your preferences and behavior, Send service-related notifications, Prevent fraudulent activities and secure your data, Comply with legal obligations and regulatory requirements."
          />
          <LegalSection
            title="3. Information Sharing and Disclosure"
            content="We do not sell or rent your personal information. Your data may be stored and processed by licensed third-party service providers. We may share your information in the following cases: Licensed Service Providers, Legal Compliance, Business Transfers, With Your Consent."
          />
          <LegalSection
            title="4. Data Security"
            content="Your personal information is protected through security measures implemented by our licensed third-party service providers and by us, including: Encryption, Secure Payment Processing, Access Controls, Regular Security Audits. We are not the primary custodians of your data; storage and processing are carried out through licensed third parties."
          />
          <LegalSection
            title="5. Data Retention"
            content="Your personal information is retained by our licensed third-party providers and by us for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Once no longer needed, your data will be securely deleted or anonymized by the relevant provider."
          />
          <LegalSection
            title="6. Your Data Rights"
            content={`Depending on your location, you may have certain rights regarding your personal data (which may be held by us or by our licensed third-party providers), including: Access, Correction, Deletion, Restriction, Portability. To exercise these rights, please contact us at [support@${Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'blowpay.app' : 'BillsByBlowmoney.com'}].`}
          />
          <LegalSection
            title="7. Third-Party Links"
            content="Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information."
          />
          <LegalSection
            title="8. Cookies and Tracking Technologies"
            content="Our platform and our licensed third-party providers use cookies and other tracking technologies to enhance your user experience and collect information about your usage of our services. You can control cookie settings through your browser, but disabling cookies may affect the functionality of the platform."
          />
          <LegalSection
            title="9. Children’s Privacy"
            content="Our services are not intended for children under the age of 18. We do not knowingly collect personal information from minors; any such data would be processed through our licensed third-party providers. If we become aware that a child has provided personal data, we will take steps to have that information deleted by the relevant provider."
          />
          <LegalSection
            title="10. Changes to This Privacy Policy"
            content="We may update this Privacy Policy from time to time to reflect changes in our practices, those of our licensed third-party providers, or legal requirements. We will notify you of any significant updates by email or through a notice on our platform. Your continued use of our services after any changes signifies your acceptance of the updated policy."
          />
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default Legal;
