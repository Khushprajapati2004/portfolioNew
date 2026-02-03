// Helper functions for generating descriptive alt text for images

export const generateProjectAltText = (projectTitle: string): string => {
  return `Screenshot of ${projectTitle} project showcasing the user interface and features`
}

export const generateSkillIconAltText = (skillName: string): string => {
  return `${skillName} technology icon`
}

export const generateProfileAltText = (name: string): string => {
  return `Professional photo of ${name}, Full-Stack Developer`
}

export const generateLogoAltText = (companyName: string): string => {
  return `${companyName} company logo`
}

// Ensure all images have meaningful alt text for accessibility and SEO
export const validateAltText = (altText: string): boolean => {
  if (!altText || altText.trim().length === 0) {
    console.warn('Image missing alt text - this affects SEO and accessibility')
    return false
  }
  
  if (altText.length < 10) {
    console.warn('Alt text too short - consider adding more description')
    return false
  }
  
  return true
}
