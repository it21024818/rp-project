// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "selectText",
    title: "Find Fake News",
    contexts: ["selection"],
  });
});

// Listen for clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Make sure the side panel is open.
  chrome.sidePanel.open({ tabId: tab.id });
  if (info.menuItemId === "selectText") {
    // Execute a script to get the selected text from the active tab
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: getSelectedText,
      },
      (results) => {
        // Check if the script returned a result
        if (results && results[0] && results[0].result) {
          // Get the URL of the active tab
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url || "";

            // Send both the selected text and URL to the side panel
            chrome.runtime.sendMessage({
              action: "sendTextToSidePanel",
              text: results[0].result,
              url: url,
            });
          });
        }
      }
    );
  }
});

// Function to get selected text from the web page
function getSelectedText() {
  const selectedText = window.getSelection().toString();
  return selectedText;
}
