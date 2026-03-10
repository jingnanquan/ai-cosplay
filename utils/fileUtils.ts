
export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error("Failed to extract base64 from file."));
        return;
      }
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = error => reject(error);
  });
};
