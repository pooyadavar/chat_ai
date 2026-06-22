window.RAYA_CONFIG = {
  // آدرس بک‌اند — dev: localhost | production: آدرس سرور
  // apiBaseUrl: 'http://localhost:3001',
  // apiBaseUrl: 'https://api.yourcompany.com',
  apiBaseUrl: 'http://localhost:3001',

  primaryColor: '#CB2957',
  position: 'bottom-right',
  fontFamily: "'IRANSansX', Tahoma, sans-serif",
  welcomeText: 'سلام داداش',
  welcomeSubtitle: 'من دستیار پشتیبان رایا هستم، چطور می‌تونم کمکتون کنم؟',
  enableChatHistory: true,
  launcherLabel: 'پشتیبان هوشمند',
  headerTitle: 'پشتیبان هوشمند رایا',

  launcher: {
    size: 56,
    sizeMobile: 48,
    sizeTablet: 52,
    sizeDesktop: 50,
    position: 'bottom-right',
    positionMobile: 'bottom-right',
    positionTablet: 'bottom-left',
    positionDesktop: 'bottom-left',
    offsetBottom: 20,
    offsetSide: 20,
  },

  faqs: [
    {
      id: 'track-order',
      title: 'پیگیری سفارش',
      description: 'وضعیت سفارش و زمان تحویل را ببینید',
      botResponse:
        'برای پیگیری سفارش، کد رهگیری یا شماره سفارش خود را وارد کنید. همچنین می‌توانید از بخش «سفارش‌های من» در پنل کاربری وضعیت ارسال را مشاهده کنید.',
    },
    {
      id: 'payment-methods',
      title: 'روش‌های پرداخت',
      description: 'درگاه‌ها و گزینه‌های پرداخت امن',
      botResponse:
        'پرداخت از طریق درگاه بانکی، کارت به کارت و پرداخت در محل (برای برخی شهرها) امکان‌پذیر است. تمام تراکنش‌ها با پروتکل SSL امن انجام می‌شوند.',
    },
    {
      id: 'shipping-time',
      title: 'زمان ارسال',
      description: 'مدت زمان ارسال به شهرهای مختلف',
      botResponse:
        'ارسال در تهران ۱ تا ۲ روز کاری و سایر شهرها ۳ تا ۵ روز کاری زمان می‌برد. سفارش‌های بالای ۵۰۰ هزار تومان ارسال رایگان دارند.',
    },
    {
      id: 'contact-support',
      title: 'تماس با پشتیبانی',
      description: 'راه‌های ارتباط با تیم پشتیبانی',
      botResponse:
        'تیم پشتیبانی رایا هر روز از ساعت ۹ تا ۲۱ پاسخگوی شماست. از طریق تلفن ۰۲۱-۱۲۳۴۵۶۷۸ یا ایمیل support@raya.ir با ما در تماس باشید.',
    },
  ],

  defaultBotResponse:
    'ممنون از سوال شما! تیم پشتیبانی رایا در حال بررسی درخواست شماست. لطفاً کمی صبر کنید یا یکی از گزینه‌های منو را انتخاب کنید.',
}
