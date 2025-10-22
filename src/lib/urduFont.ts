// Utility to load and prepare Urdu font for jsPDF
import { jsPDF } from "jspdf";

let fontLoaded = false;

export const loadUrduFont = async (doc: jsPDF) => {
  if (fontLoaded) return;

  try {
    // Fetch the font file from the installed package
    const response = await fetch(
      new URL(
        "@fontsource/noto-nastaliq-urdu/files/noto-nastaliq-urdu-arabic-400-normal.woff",
        import.meta.url
      ).href
    );

    if (!response.ok) {
      console.warn("Could not load Urdu font, using default");
      return;
    }

    const fontData = await response.arrayBuffer();
    const base64Font = btoa(
      String.fromCharCode(...new Uint8Array(fontData))
    );

    // Add font to jsPDF
    doc.addFileToVFS("NotoNastaliqUrdu.ttf", base64Font);
    doc.addFont("NotoNastaliqUrdu.ttf", "NotoNastaliqUrdu", "normal");
    
    fontLoaded = true;
  } catch (error) {
    console.error("Error loading Urdu font:", error);
  }
};
