import { View, ScrollView } from "@/ui";
import Markdown from "react-native-markdown-display";

const copy = `
# VarcityChat – Terms of Use & Privacy Policy

**Effective Date:** 2025-01-01

Welcome to **VarcityChat** – a platform designed to help students across campuses connect, share, and communicate. By using this app, you agree to the following Terms of Use and Privacy Policy.


---


## 🔒 Privacy Policy

### 1. What We Collect
We may collect:
- Email address or student ID for account creation  
- Messages and content you send  
- Device information for analytics and moderation  

### 2. How We Use Your Information
We use your information to:
- Enable messaging and user interaction  
- Moderate content for safety  
- Improve app functionality  

We **do not sell** your data to third parties.

### 3. Your Data Rights
You can:
- Request deletion of your account and data  
- Report content or users at any time  

Contact us at **varcitychat@gmail.com** for data-related requests.


---


## 📜 Terms of Use (EULA)

### 1. Acceptance of Terms
By using VarcityChat, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the app.

### 2. User Conduct
You must not post or share content that is:
- Abusive, hateful, or harassing  
- Sexually explicit or violent  
- Discriminatory, racist, or illegal  
- Spam, advertising, or phishing-related  

We operate a **zero-tolerance policy** for objectionable content. Violations may result in immediate ban without warning.

### 3. Reporting and Moderation
- Users can **report** objectionable content or abusive behavior via the app.  
- Users can **block** others to prevent further contact.  
- Reports are reviewed **within 24 hours**, and we may remove content or ban users as necessary.

### 4. Content Ownership
You retain ownership of your content, but grant us a non-exclusive license to display and store your content for app functionality.

### 5. Changes to Terms
We may update these terms occasionally. Continued use of the app means you accept the revised terms.


---


## 📬 Contact Us
For questions, concerns, or to report abuse:  
**Email:** varcitychat@gmail.com  
**App Name:** VarcityChat  
**Developer:** VarcityChat Team

---

## ✅ Agreement
By creating an account or using VarcityChat, you confirm that you are at least 13 years old and agree to these terms.`;

export default function TermsAndConditions() {
  return (
    <View className="flex-1 bg-white dark:bg-charcoal-900">
      <View className="p-4 flex-row items-center"></View>
      <View className="flex-1">
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: "100%", paddingHorizontal: 16 }}
        >
          <Markdown>{copy}</Markdown>
        </ScrollView>
      </View>
    </View>
  );
}
