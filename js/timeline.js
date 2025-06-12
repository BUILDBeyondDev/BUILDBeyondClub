// Timeline Automation with Folder Link Image Support

/**
 * Read timeline data from Google Sheet (folder link approach)
 */
function getTimelineData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    throw new Error(`Sheet named "${CONFIG.SHEET_NAME}" not found. Make sure you have a sheet tab named "Timeline"`);
  }
  
  const data = sheet.getDataRange().getValues();
  console.log('Raw sheet data:', data);
  
  // Skip header row and filter out empty rows
  const timelineData = data.slice(1).map(row => ({
    yearId: row[0],
    displayDate: row[1],
    eventType: row[2],
    title: row[3],
    description: row[4],
    folderLink: row[5] || null // Google Drive folder link
  })).filter(item => item.yearId && item.yearId.toString().trim()); // Remove empty rows
  
  if (timelineData.length === 0) {
    throw new Error('No timeline data found in the sheet. Make sure you have data in rows below the header.');
  }
  
  // Get images for each timeline item
  const timelineWithImages = timelineData.map(item => ({
    ...item,
    images: item.folderLink ? getImagesFromFolderLink(item.folderLink) : []
  }));
  
  return timelineWithImages;
}

/**
 * Get all images from a Google Drive folder using its sharing link
 */
function getImagesFromFolderLink(folderLink) {
  try {
    if (!folderLink || typeof folderLink !== 'string') {
      return [];
    }
    
    // Extract folder ID from Google Drive folder link
    let folderId = null;
    
    // Try different Google Drive URL formats
    const folderIdMatch1 = folderLink.match(/\/folders\/([a-zA-Z0-9-_]+)/);
    const folderIdMatch2 = folderLink.match(/id=([a-zA-Z0-9-_]+)/);
    
    if (folderIdMatch1) {
      folderId = folderIdMatch1[1];
    } else if (folderIdMatch2) {
      folderId = folderIdMatch2[1];
    } else {
      console.log(`Could not extract folder ID from: ${folderLink}`);
      return [];
    }
    
    // Get the folder by ID
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    const images = [];
    
    // Get all image files from the folder
    while (files.hasNext() && images.length < 4) { // Limit to 4 images max
      const file = files.next();
      const mimeType = file.getBlob().getContentType();
      
      // Check if it's an image file
      if (mimeType.startsWith('image/')) {
        // Make file publicly viewable and get direct link
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        const fileId = file.getId();
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        
        images.push({
          name: file.getName(),
          url: directUrl
        });
      }
    }
    
    console.log(`Found ${images.length} images in folder: ${folderId}`);
    return images;
    
  } catch (error) {
    console.error(`Error getting images from folder link "${folderLink}":`, error);
    return [];
  }
}

/**
 * Generate image gallery HTML
 */
function generateImageGallery(images) {
  if (!images || images.length === 0) return '';
  
  const galleryImages = images.map((img, index) => 
    `<img src="${img.url}" alt="${img.name}" class="timeline-gallery-image" loading="lazy" title="${img.name}">`
  ).join('');
  
  return `
    <div class="timeline-image-gallery">
      ${galleryImages}
    </div>`;
}

/**
 * Generate the complete timeline HTML
 */
function generateTimelineHTML(timelineData) {
  // Generate markers HTML
  const markersHTML = timelineData.map((item, index) => {
    const position = 10 + (index * 75 / Math.max(timelineData.length - 1, 1));
    const activeClass = index === 0 ? ' active' : '';
    
    return `        <div class="timeline-marker${activeClass}" data-year="${item.yearId}" style="top: ${position}%;">
          <div class="timeline-year">${item.displayDate}</div>
        </div>`;
  }).join('\n');

  // Generate content HTML with images
  const contentHTML = timelineData.map((item, index) => {
    const activeClass = index === 0 ? ' active' : '';
    const imageGallery = generateImageGallery(item.images);
    
    return `    <div class="timeline-item${activeClass}" data-year="${item.yearId}">
      <div class="event-tag">${item.eventType}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>${imageGallery ? '\n      ' + imageGallery : ''}
    </div>`;
  }).join('\n\n');

  // Complete HTML template
  return `---
layout: default
title: "Timeline"
---

<div class="timeline-section">
  <h2>Our Timeline</h2>
  
  <!-- Fixed sidebar with timeline markers -->
  <div class="timeline-sidebar">
    <div class="timeline-track">
      <div class="timeline-progress"></div>
      <div class="timeline-markers">
${markersHTML}
      </div>
    </div>
  </div>

  <!-- Main content area that flows with page scroll -->
  <div class="timeline-content">
${contentHTML}
  </div>
</div>`;
}

/**
 * Test function specifically for folder links
 */
function testFolderLinks() {
  console.log('Testing folder link access...');
  
  try {
    const timelineData = getTimelineData();
    
    timelineData.forEach(item => {
      console.log(`Event: ${item.title}`);
      console.log(`Folder Link: ${item.folderLink}`);
      console.log(`Images found: ${item.images.length}`);
      item.images.forEach(img => {
        console.log(`  - ${img.name}: ${img.url}`);
      });
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error testing folder links:', error);
  }
}