export function calculateBand(birthDate: Date): { band: number; label: string; description: string } {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age <= 5) {
    return { band: 0, label: 'Picture Book', description: 'Ages 3-5' };
  } else if (age <= 8) {
    return { band: 1, label: 'Story Mode', description: 'Ages 6-8' };
  } else if (age <= 11) {
    return { band: 2, label: 'Explorer', description: 'Ages 9-11' };
  } else if (age <= 14) {
    return { band: 3, label: 'Scholar', description: 'Ages 12-14' };
  } else if (age <= 17) {
    return { band: 4, label: 'Apprentice Historian', description: 'Ages 15-17' };
  } else {
    return { band: 5, label: 'University Prep', description: 'Ages 18+' };
  }
}
