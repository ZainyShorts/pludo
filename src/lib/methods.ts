export function getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  

  export function capitalizeCustom(str:string) {
    return str.replace(/\b\w|(?<=-)\w|(?<=&)\w/g, match => match.toUpperCase());
  }
  
  
  export const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        console.log("Text copied to clipboard:", text);
    } catch (err) {
        console.error("Failed to copy text:", err);
    }
  };
  