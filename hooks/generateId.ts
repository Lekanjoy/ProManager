// Generate a unique comment ID
export const generateCommentId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000); 

  return `${timestamp}-${random}`;
}