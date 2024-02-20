export function downloadFile(uint8Array: Uint8Array[], filename: string, mimeType: string) {
  // Create a Blob from the Uint8Array
  const blob = new Blob(uint8Array, { type: mimeType })

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob)

  // Create a link element
  const link = document.createElement("a")
  link.href = url
  link.download = filename

  // Append the link to the document body
  document.body.appendChild(link)

  // Trigger the download
  link.click()

  // Clean up: remove the link and revoke the temporary URL
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
