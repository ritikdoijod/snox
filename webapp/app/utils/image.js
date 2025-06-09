export async function getBase64Image(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to upload image");
  const blob = await response.blob();

  const base64Image = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });

  return base64Image;
}
