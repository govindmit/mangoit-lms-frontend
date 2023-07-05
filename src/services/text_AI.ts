import axios from "axios";

export const HandleAIText = async (text: any, key: any) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "assistant", content: `${text}` }],
        max_tokens: 80,
        temperature: 0.2,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    let textData = response?.data?.choices[0]?.message?.content;
    return textData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const HandleAILongText = async (text: any, key: any) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${text}` }],
        max_tokens: 110,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    let textData = response?.data?.choices[0]?.message?.content;
    return textData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const aiBtnCss = {
  animation: "spin 2s linear infinite",
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
};

//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
