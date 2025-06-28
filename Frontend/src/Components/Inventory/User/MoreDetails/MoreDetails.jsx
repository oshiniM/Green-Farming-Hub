import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

function MoreDetails() {
  const location = useLocation();
  const { item } = location.state;

  const generatePDF = () => {
    try {
      const doc = new jsPDF("p", "pt", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginLeft = 40;
      const marginRight = 40;
      const marginTop = 30;
      const marginBottom = 40;
      const textWidth = pageWidth - marginLeft - marginRight;
      const effectivePageHeight = pageHeight - marginTop - marginBottom;
      
      // Add Title
      doc.setFontSize(24);
      doc.setTextColor(40);
      doc.setFont(undefined, "bold");
      doc.text(item.title, marginLeft, marginTop);
  
      // Add User Information
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`By: ${item.uname}`, marginLeft, marginTop + 30);
  
      // Starting Y position
      let yPosition = marginTop + 50;
  
      // Function to check if we need a new page
      const checkForNewPage = (requiredHeight) => {
        if (yPosition + requiredHeight > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = marginTop; // Reset Y position for new page
          return true;
        }
        return false;
      };
  
      // Helper function to add sections with pagination
      const addSection = (title, content) => {
        // Make sure content is a string
        const safeContent = content || "N/A";
        
        // Check if we need to start a new page for the section title
        checkForNewPage(40); // 40pt for title + initial spacing
        
        // Add section title
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(title, marginLeft, yPosition);
        yPosition += 20;
        
        // Add section content with pagination
        doc.setFontSize(12);
        doc.setFont(undefined, "normal");
        
        // Split text into lines to handle overflow
        const textLines = doc.splitTextToSize(safeContent, textWidth);
        
        // Add text with pagination
        let currentLine = 0;
        while (currentLine < textLines.length) {
          // Check remaining space on current page
          const linesRemaining = Math.floor((pageHeight - marginBottom - yPosition) / 15);
          const linesToAdd = Math.min(linesRemaining, textLines.length - currentLine);
          
          if (linesToAdd <= 0) {
            // No space left on this page, add a new page
            doc.addPage();
            yPosition = marginTop;
            continue;
          }
          
          // Add as many lines as will fit on current page
          const currentPageLines = textLines.slice(currentLine, currentLine + linesToAdd);
          doc.text(currentPageLines, marginLeft, yPosition);
          
          // Update counters
          currentLine += linesToAdd;
          yPosition += linesToAdd * 15;
          
          // Add a new page if we have more lines to add
          if (currentLine < textLines.length) {
            doc.addPage();
            yPosition = marginTop;
          }
        }
        
        // Add spacing after the section
        yPosition += 20;
      };
  
      // Handle image asynchronously with proper pagination
      if (item.imgurl) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = function() {
          // Calculate image dimensions while preserving aspect ratio
          const imgWidth = textWidth;
          const imgHeight = (img.height * imgWidth) / img.width;
          
          // Check if we need a new page for the image
          checkForNewPage(imgHeight + 10);
          
          // Add the image
          doc.addImage(img, "JPEG", marginLeft, yPosition, imgWidth, imgHeight);
          
          // Update position after image
          yPosition += imgHeight + 20;
          
          // Add all text sections
          addSection("Crop Details", item.disc);
          addSection("Fertilizer Used", item.fertilizer);
          addSection("Pest and Disease Information", item.pest);
          addSection("Pest Control Methods", item.pestcontral);
          addSection("Challenges Faced", item.challenge);
          addSection("Work Done and Future Plans", item.work);
          
          // Save the PDF
          doc.save(`${item.title}_report.pdf`);
        };
        
        img.onerror = function() {
          console.error("Failed to load image");
          
          // Continue without the image
          addSection("Crop Details", item.disc);
          addSection("Fertilizer Used", item.fertilizer);
          addSection("Pest and Disease Information", item.pest);
          addSection("Pest Control Methods", item.pestcontral);
          addSection("Challenges Faced", item.challenge);
          addSection("Work Done and Future Plans", item.work);
          
          doc.save(`${item.title}_report.pdf`);
        };
        
        img.src = item.imgurl;
      } else {
        // No image, just add text sections
        addSection("Crop Details", item.disc);
        addSection("Fertilizer Used", item.fertilizer);
        addSection("Pest and Disease Information", item.pest);
        addSection("Pest Control Methods", item.pestcontral);
        addSection("Challenges Faced", item.challenge);
        addSection("Work Done and Future Plans", item.work);
        
        doc.save(`${item.title}_report.pdf`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again later.");
    }
  };

  return (
    <div className="h-auto bg-white py-10 px-4 mb-20">
      <div className="mx-auto bg-white shadow-lg rounded-lg w-[1100px] overflow-hidden">
        {/* Image Section */}
        <div className="relative h-[400px]">
          <img
            src={item.imgurl}
            alt="Plant"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Blog Content */}
        <div className="p-8">
          {/* Title */}
          <h1 className="text-[60px] font-bold mb-4 text-black">{item.title}</h1>

          {/* User Details */}
          <p className="text-lg text-gray-500 mb-14">
            By <span className="font-semibold">{item.uname}</span>
          </p>

          {/* Plant Description */}
          <section className="mb-14">
            <h2 className="text-2xl font-semibold mb-3">
              <span className="text-green-600">Crop </span>Details
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">{item.disc}</p>
          </section>

          {/* Fertilizer Info */}
          <section className="mb-14">
            <h2 className="text-2xl font-semibold mb-3">
              <span className="text-green-600">Fertilizer</span> Used
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">{item.fertilizer}</p>
          </section>

          {/* Pest and Disease Info */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              <span className="text-green-600">Pest and Disease</span> Information
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">{item.pest}</p>
          </section>

          {/* Pest Control Methods */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              <span className="text-green-600">Pest Control</span> Methods
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">{item.pestcontral}</p>
          </section>

          {/* Challenges Faced */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              <span className="text-green-600">Challenges</span> Faced
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">{item.challenge}</p>
          </section>

          {/* Work Done and Future Plans */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              <span className="text-green-600">Work Done and Future </span> Plans
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">{item.work}</p>
          </section>
        </div>
      </div>

      {/* Generate PDF Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={generatePDF}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500"
        >
          Download Report as PDF
        </button>
      </div>
    </div>
  );
}

export default MoreDetails;
