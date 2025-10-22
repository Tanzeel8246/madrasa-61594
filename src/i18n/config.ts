import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      students: 'Students',
      teachers: 'Teachers',
      classes: 'Classes',
      attendance: 'Attendance',
      courses: 'Courses',
      learningReport: 'Learning Report',
      
      // Common
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      save: 'Save',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      myAccount: 'My Account',
      signOut: 'Sign Out',
      admin: 'Admin',
      adminUser: 'Admin User',
      
      // Header
      searchPlaceholder: 'Search students, teachers, classes...',
      notifications: 'Notifications',
      
      // Branding
      appTitle: 'Madrasa',
      appSubtitle: 'Management Kit',
      
      // Student fields
      name: 'Name',
      fatherName: "Father's Name",
      class: 'Class',
      admissionDate: 'Admission Date',
      contact: 'Contact',
      age: 'Age',
      grade: 'Grade',
      status: 'Status',
    }
  },
  ur: {
    translation: {
      // Navigation
      dashboard: 'ڈیش بورڈ',
      students: 'طلباء',
      teachers: 'اساتذہ',
      classes: 'کلاسز',
      attendance: 'حاضری',
      courses: 'کورسز',
      learningReport: 'تعلیمی رپورٹ',
      
      // Common
      add: 'شامل کریں',
      edit: 'ترمیم',
      delete: 'حذف کریں',
      cancel: 'منسوخ',
      save: 'محفوظ کریں',
      search: 'تلاش کریں',
      filter: 'فلٹر',
      export: 'ایکسپورٹ',
      myAccount: 'میرا اکاؤنٹ',
      signOut: 'سائن آؤٹ',
      admin: 'ایڈمن',
      adminUser: 'ایڈمن صارف',
      
      // Header
      searchPlaceholder: 'طلباء، اساتذہ، کلاسز تلاش کریں...',
      notifications: 'اطلاعات',
      
      // Branding
      appTitle: 'مدرسہ',
      appSubtitle: 'مینجمنٹ کٹ',
      
      // Student fields
      name: 'نام',
      fatherName: 'والد کا نام',
      class: 'کلاس',
      admissionDate: 'داخلے کی تاریخ',
      contact: 'رابطہ',
      age: 'عمر',
      grade: 'درجہ',
      status: 'حیثیت',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;