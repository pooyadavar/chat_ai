export function getTimeGreeting(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'صبحت بخیر'
  if (hour >= 12 && hour < 17) return 'ظهرت بخیر'
  if (hour >= 17 && hour < 21) return 'عصرت بخیر'
  return 'شبت بخیر'
}

export function getWelcomeGreeting(): string {
  return `سلام! ${getTimeGreeting()} 👋`
}
