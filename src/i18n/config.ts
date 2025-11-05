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
      fees: 'Fees',
      userRoles: 'User Roles',
      
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
      notifications: 'Notifications',
      noNewNotifications: 'No new notifications',
      pendingJoinRequests: 'pending join requests',
      viewAllRequests: 'View All Requests',
      adminUser: 'Admin User',
      teacher: 'Teacher',
      actions: 'Actions',
      view: 'View',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      close: 'Close',
      loading: 'Loading...',
      noData: 'No data available',
      
      // Profile
      manageProfile: 'Manage your profile and preferences',
      accountDetails: 'Account Details',
      personalInformation: 'Personal information',
      fullName: 'Full Name',
      enterFullName: 'Enter your full name',
      madrasaDetails: 'Madrasa Details',
      madrasaInformation: 'Madrasa information and branding',
      madrasaName: 'Madrasa Name',
      enterMadrasaName: 'Enter madrasa name',
      madrasaLogo: 'Madrasa Logo',
      uploadLogo: 'Upload Logo',
      changeLogo: 'Change Logo',
      logoSizeLimit: 'Maximum size: 2MB (JPG, PNG)',
      saveChanges: 'Save Changes',
      profileUpdated: 'Profile updated successfully',
      
      // Header
      searchPlaceholder: 'Search students, teachers, classes...',
      language: 'Language',
      
      // Branding
      appTitle: 'Madrasa',
      appSubtitle: 'Management Kit',
      
      // Dashboard
      totalStudents: 'Total Students',
      totalTeachers: 'Total Teachers',
      totalClasses: 'Total Classes',
      activeStudents: 'Active Students',
      todayAttendance: 'Today\'s Attendance',
      pendingFees: 'Pending Fees',
      overview: 'Overview',
      upcomingClasses: 'Upcoming Classes',
      todaySchedule: 'Today\'s schedule overview',
      viewAllClasses: 'View All Classes',
      recentActivity: 'Recent Activity',
      latestUpdates: 'Latest updates and actions',
      viewAllActivity: 'View All Activity',
      quickActions: 'Quick Actions',
      commonTasks: 'Common tasks and shortcuts',
      addStudent: 'Add Student',
      addTeacher: 'Add Teacher',
      createClass: 'Create Class',
      
      // Student fields
      name: 'Name',
      fatherName: "Father's Name",
      class: 'Class',
      admissionDate: 'Admission Date',
      contact: 'Contact',
      age: 'Age',
      grade: 'Grade',
      status: 'Status',
      photo: 'Photo',
      email: 'Email',
      
      // Teacher fields
      qualification: 'Qualification',
      subject: 'Subject',
      specialization: 'Specialization',
      
      // Class fields
      room: 'Room',
      schedule: 'Schedule',
      duration: 'Duration',
      level: 'Level',
      year: 'Year',
      section: 'Section',
      
      // Attendance
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      leave: 'Leave',
      date: 'Date',
      time: 'Time',
      markAttendance: 'Mark Attendance',
      
      // Fees
      amount: 'Amount',
      dueDate: 'Due Date',
      paid: 'Paid',
      pending: 'Pending',
      feeType: 'Fee Type',
      academicYear: 'Academic Year',
      paymentScreenshot: 'Payment Screenshot',
      
      // Education Reports
      sabak: 'Sabak (New Lesson)',
      sabqi: 'Sabqi (Revision)',
      manzil: 'Manzil',
      remarks: 'Remarks',
      paraNo: 'Para Number',
      recited: 'Recited',
      heardBy: 'Heard By',
      
      // User Roles
      role: 'Role',
      assignRole: 'Assign Role',
      inviteUser: 'Invite User',
      
      // Forms
      requiredField: 'This field is required',
      invalidEmail: 'Invalid email address',
      selectOption: 'Select an option',
      
      // Auth page
      schoolManagementSystem: 'School Management System',
      login: 'Login',
      signup: 'Sign Up',
      loginOrSignup: 'Login to your account or create a new one',
      continueWithGoogle: 'Continue with Google',
      orWithEmail: 'Or with email',
      enterPassword: 'Enter password',
      loginButton: 'Login',
      newMadrasa: 'New Madrasa',
      joinExisting: 'Join Existing',
      createPassword: 'Create password',
      createNewMadrasa: 'Create New Madrasa (Admin)',
      youWillBeAdmin: 'You will be the admin of this madrasa',
      mobileNumber: 'Mobile Number',
      enterMobile: 'Enter mobile number',
      selectRole: 'Select Role',
      sendRequest: 'Send Request',
      joinRequestNote: 'Your request will be sent to the admin. You will receive an email after approval',
      fillAllFields: 'Please fill all fields',
      joinRequestSuccess: 'Request submitted! Wait for admin approval',
      joinRequestError: 'Error submitting request',
      creatingAccount: 'Creating account...',
      user: 'User',
      
      // Messages
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      confirmDelete: 'Are you sure you want to delete this?',
      exportSuccess: 'Export successful',
      exportError: 'Error exporting data',
      
      // Page specific
      manageStudents: 'Manage your madrasa students',
      manageTeachers: 'Manage your madrasa instructors',
      manageFees: 'Manage student fees and payments',
      searchStudents: 'Search students...',
      searchTeachers: 'Search teachers...',
      searchFees: 'Search fees...',
      noStudentsFound: 'No students found matching your search',
      noTeachersFound: 'No teachers found matching your search',
      noFeesFound: 'No fees found. Add your first fee to get started',
      deleteTeacherWarning: 'This action cannot be undone. This will permanently delete the teacher record.',
      deleteFeeWarning: 'This action cannot be undone. This will permanently delete the fee record.',
      feeManagement: 'Fee Management',
      allFees: 'All Fees',
      addFee: 'Add Fee',
      overdue: 'Overdue',
      partial: 'Partial',
      attendanceRecords: 'Attendance Records',
      noAttendanceRecords: 'No attendance records for this date',
      selectDate: 'Select Date',
      selectDateDesc: 'View attendance for a specific date',
      excused: 'Excused',
      unknown: 'Unknown',
      noClass: 'No Class',
      
      // Role change
      requestRoleChange: 'Request Role Change',
      currentRole: 'Current Role',
      requestedRole: 'Requested Role',
      requestMessage: 'Request Message',
      explainReason: 'Explain why you need this role change',
      submitRequest: 'Submit Request',
      roleChangeRequests: 'Role Change Requests',
      trackRequests: 'Track your role change requests',
      adminResponse: 'Admin Response',
      requestChange: 'Request Change',
      adminName: 'Admin Name',
      manager: 'Manager',
      parent: 'Parent',
      
      // Offline/Online Status
      online: 'Online',
      offline: 'Offline',
      pendingChanges: 'pending changes',
      syncNow: 'Sync Now',
      offlineSaved: 'Offline: Changes will sync later',
      onlineSyncing: 'Online! Syncing data...',
      syncComplete: 'All changes synced',
      syncError: 'Sync error',
      
      // Reports
      reports: {
        menu: 'Reports',
        title: 'Reports & Analytics',
        subtitle: 'Generate comprehensive PDF reports with advanced filtering',
      },
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
      fees: 'فیسیں',
      userRoles: 'صارف کے کردار',
      
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
      notifications: 'اطلاعات',
      noNewNotifications: 'کوئی نئی اطلاع نہیں',
      pendingJoinRequests: 'زیر التوا درخواستیں',
      viewAllRequests: 'تمام درخواستیں دیکھیں',
      adminUser: 'ایڈمن صارف',
      teacher: 'استاد',
      actions: 'اقدامات',
      view: 'دیکھیں',
      back: 'واپس',
      next: 'اگلا',
      submit: 'جمع کرائیں',
      close: 'بند کریں',
      loading: 'لوڈ ہو رہا ہے...',
      noData: 'کوئی ڈیٹا دستیاب نہیں',
      
      // Profile
      manageProfile: 'اپنی پروفائل اور ترجیحات کا انتظام کریں',
      accountDetails: 'اکاؤنٹ کی تفصیلات',
      personalInformation: 'ذاتی معلومات',
      fullName: 'مکمل نام',
      enterFullName: 'اپنا مکمل نام درج کریں',
      madrasaDetails: 'مدرسہ کی تفصیلات',
      madrasaInformation: 'مدرسہ کی معلومات اور برانڈنگ',
      madrasaName: 'مدرسہ کا نام',
      enterMadrasaName: 'مدرسہ کا نام درج کریں',
      madrasaLogo: 'مدرسہ کا لوگو',
      uploadLogo: 'لوگو اپ لوڈ کریں',
      changeLogo: 'لوگو تبدیل کریں',
      logoSizeLimit: 'زیادہ سے زیادہ سائز: 2MB (JPG, PNG)',
      saveChanges: 'تبدیلیاں محفوظ کریں',
      profileUpdated: 'پروفائل کامیابی سے اپ ڈیٹ ہو گئی',
      
      // Header
      searchPlaceholder: 'طلباء، اساتذہ، کلاسز تلاش کریں...',
      language: 'زبان',
      
      // Branding
      appTitle: 'مدرسہ',
      appSubtitle: 'مینجمنٹ کٹ',
      
      // Dashboard
      totalStudents: 'کل طلباء',
      totalTeachers: 'کل اساتذہ',
      totalClasses: 'کل کلاسز',
      activeStudents: 'فعال طلباء',
      todayAttendance: 'آج کی حاضری',
      pendingFees: 'باقی فیسیں',
      overview: 'جائزہ',
      upcomingClasses: 'آنے والی کلاسز',
      todaySchedule: 'آج کے شیڈول کا جائزہ',
      viewAllClasses: 'تمام کلاسز دیکھیں',
      recentActivity: 'حالیہ سرگرمیاں',
      latestUpdates: 'تازہ ترین اپ ڈیٹس اور اقدامات',
      viewAllActivity: 'تمام سرگرمیاں دیکھیں',
      quickActions: 'فوری اقدامات',
      commonTasks: 'عام کام اور شارٹ کٹس',
      addStudent: 'طالب علم شامل کریں',
      addTeacher: 'استاد شامل کریں',
      createClass: 'کلاس بنائیں',
      
      // Student fields
      name: 'نام',
      fatherName: 'والد کا نام',
      class: 'کلاس',
      admissionDate: 'داخلے کی تاریخ',
      contact: 'رابطہ',
      age: 'عمر',
      grade: 'درجہ',
      status: 'حیثیت',
      photo: 'تصویر',
      email: 'ای میل',
      
      // Teacher fields
      qualification: 'قابلیت',
      subject: 'مضمون',
      specialization: 'خصوصیت',
      
      // Class fields
      room: 'کمرہ',
      schedule: 'شیڈول',
      duration: 'دورانیہ',
      level: 'سطح',
      year: 'سال',
      section: 'سیکشن',
      
      // Attendance
      present: 'حاضر',
      absent: 'غیر حاضر',
      late: 'تاخیر',
      leave: 'چھٹی',
      date: 'تاریخ',
      time: 'وقت',
      markAttendance: 'حاضری لگائیں',
      
      // Fees
      amount: 'رقم',
      dueDate: 'آخری تاریخ',
      paid: 'ادا شدہ',
      pending: 'باقی',
      feeType: 'فیس کی قسم',
      academicYear: 'تعلیمی سال',
      paymentScreenshot: 'ادائیگی کی تصویر',
      
      // Education Reports
      sabak: 'سبق (نیا سبق)',
      sabqi: 'سبقی (دہرائی)',
      manzil: 'منزل',
      remarks: 'تبصرے',
      paraNo: 'پارہ نمبر',
      recited: 'سنایا',
      heardBy: 'سننے والا',
      
      // User Roles
      role: 'کردار',
      assignRole: 'کردار تفویض کریں',
      inviteUser: 'صارف کو مدعو کریں',
      
      // Forms
      requiredField: 'یہ فیلڈ ضروری ہے',
      invalidEmail: 'غلط ای میل پتہ',
      selectOption: 'ایک آپشن منتخب کریں',
      
      // Auth page
      schoolManagementSystem: 'اسکول مینجمنٹ سسٹم',
      login: 'لاگ ان',
      signup: 'سائن اپ',
      loginOrSignup: 'اپنے اکاؤنٹ میں داخل ہوں یا نیا اکاؤنٹ بنائیں',
      continueWithGoogle: 'گوگل کے ساتھ جاری رکھیں',
      orWithEmail: 'یا ای میل کے ساتھ',
      enterPassword: 'پاس ورڈ درج کریں',
      loginButton: 'لاگ ان کریں',
      newMadrasa: 'نیا مدرسہ',
      joinExisting: 'موجودہ میں شامل',
      createPassword: 'پاس ورڈ بنائیں',
      createNewMadrasa: 'نیا مدرسہ بنائیں (ایڈمن)',
      youWillBeAdmin: 'آپ اس مدرسہ کے ایڈمن بن جائیں گے',
      mobileNumber: 'موبائل نمبر',
      enterMobile: 'موبائل نمبر درج کریں',
      selectRole: 'رول منتخب کریں',
      sendRequest: 'درخواست بھیجیں',
      joinRequestNote: 'آپ کی درخواست ایڈمن کو بھیج دی جائے گی۔ منظوری کے بعد آپ کو ای میل موصول ہو گی',
      fillAllFields: 'تمام فیلڈز پُر کریں',
      joinRequestSuccess: 'درخواست جمع کرا دی گئی! ایڈمن کی منظوری کا انتظار کریں',
      joinRequestError: 'درخواست جمع کرانے میں خرابی',
      creatingAccount: 'اکاؤنٹ بن رہا ہے...',
      user: 'صارف',
      
      // Messages
      success: 'کامیابی',
      error: 'خرابی',
      warning: 'انتباہ',
      confirmDelete: 'کیا آپ واقعی اسے حذف کرنا چاہتے ہیں؟',
      exportSuccess: 'ایکسپورٹ کامیاب',
      exportError: 'ڈیٹا ایکسپورٹ کرنے میں خرابی',
      
      // Page specific
      manageStudents: 'اپنے مدرسے کے طلباء کا انتظام کریں',
      manageTeachers: 'اپنے مدرسے کے اساتذہ کا انتظام کریں',
      manageFees: 'طلباء کی فیسوں کا انتظام کریں',
      searchStudents: 'طلباء تلاش کریں...',
      searchTeachers: 'اساتذہ تلاش کریں...',
      searchFees: 'فیسیں تلاش کریں...',
      noStudentsFound: 'آپ کی تلاش سے مماثل کوئی طالب علم نہیں ملا',
      noTeachersFound: 'آپ کی تلاش سے مماثل کوئی استاد نہیں ملا',
      noFeesFound: 'کوئی فیس نہیں ملی۔ پہلی فیس شامل کریں',
      deleteTeacherWarning: 'یہ عمل کالعدم نہیں ہو سکتا۔ یہ استاد کا ریکارڈ مستقل طور پر حذف کر دے گا۔',
      deleteFeeWarning: 'یہ عمل کالعدم نہیں ہو سکتا۔ یہ فیس کا ریکارڈ مستقل طور پر حذف کر دے گا۔',
      feeManagement: 'فیس کا انتظام',
      allFees: 'تمام فیسیں',
      addFee: 'فیس شامل کریں',
      overdue: 'مدت ختم',
      partial: 'جزوی',
      attendanceRecords: 'حاضری کے ریکارڈز',
      noAttendanceRecords: 'اس تاریخ کے لیے کوئی حاضری ریکارڈ نہیں',
      selectDate: 'تاریخ منتخب کریں',
      selectDateDesc: 'کسی مخصوص تاریخ کے لیے حاضری دیکھیں',
      excused: 'معذور',
      unknown: 'نامعلوم',
      noClass: 'کوئی کلاس نہیں',
      
      // Role change
      requestRoleChange: 'رول تبدیلی کی درخواست',
      currentRole: 'موجودہ رول',
      requestedRole: 'مطلوبہ رول',
      requestMessage: 'درخواست کا پیغام',
      explainReason: 'رول تبدیلی کی وجہ بیان کریں',
      submitRequest: 'درخواست جمع کرائیں',
      roleChangeRequests: 'رول تبدیلی کی درخواستیں',
      trackRequests: 'اپنی درخواستوں کو ٹریک کریں',
      adminResponse: 'ایڈمن کا جواب',
      requestChange: 'تبدیلی کی درخواست',
      adminName: 'ایڈمن کا نام',
      manager: 'منیجر',
      parent: 'والدین',
      
      // Offline/Online Status
      online: 'آن لائن',
      offline: 'آف لائن',
      pendingChanges: 'تبدیلیاں منتظر',
      syncNow: 'ابھی Sync کریں',
      offlineSaved: 'آف لائن: تبدیلیاں بعد میں sync ہوں گی',
      onlineSyncing: 'آن لائن ہو گئے! ڈیٹا sync ہو رہا ہے...',
      syncComplete: 'تمام تبدیلیاں sync ہو گئیں',
      syncError: 'Sync میں مسئلہ',
      
      // Reports
      reports: {
        menu: 'رپورٹس',
        title: 'رپورٹس اور تجزیات',
        subtitle: 'جدید فلٹرنگ کے ساتھ جامع پی ڈی ایف رپورٹس بنائیں',
      },
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