# Image Modal Test

This document tests the new image modal functionality in doc-builder.

## Sample Images

Here are some test images to demonstrate the modal functionality:

### Screenshot with Good Alt Text

![Doc-builder navigation showing the sidebar with collapsible sections and search functionality](https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Sample+Screenshot)

This image should open in a modal when clicked, showing the alt text as a caption.

### Diagram Example

![Flow diagram showing the authentication process from login to dashboard access](https://via.placeholder.com/600x400/10B981/FFFFFF?text=Authentication+Flow)

### Image Without Alt Text

![](https://via.placeholder.com/400x300/EF4444/FFFFFF?text=No+Alt+Text)

This image has no alt text, so the caption should be hidden in the modal.

### Multiple Images in a Row

![Small thumbnail showing user profile settings](https://via.placeholder.com/200x150/F59E0B/FFFFFF?text=Settings)
![Configuration panel displaying API key management options](https://via.placeholder.com/200x150/8B5CF6/FFFFFF?text=API+Keys)
![Dashboard overview with analytics charts and metrics](https://via.placeholder.com/200x150/06B6D4/FFFFFF?text=Dashboard)

## Features to Test

When you click on any image above, you should see:

1. **Modal Opens**: A dark overlay appears with the image centered
2. **Large View**: The image scales to fit the screen while maintaining aspect ratio
3. **Close Button**: An "×" button appears in the top-right corner
4. **Caption Display**: The alt text appears below the image (if present)
5. **Close Functionality**: 
   - Click the × button to close
   - Click outside the image to close
   - Press Escape key to close
6. **Hover Effects**: Images should have a subtle hover effect before clicking
7. **Responsive**: Should work well on different screen sizes

## Expected Behavior

- Images should be clickable (cursor changes to pointer)
- Smooth transitions and animations
- No page scrolling when modal is open
- Modal should be accessible and keyboard-friendly
- Works in both light and dark themes

This test demonstrates the image modal system working with various alt text scenarios and image sizes.