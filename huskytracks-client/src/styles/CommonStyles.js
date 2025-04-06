export const heroStyles = {
    container: {
      height: "90vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      textAlign: "center",
      p: 3,
    },
    title: {
      color: "#b00020",
      fontWeight: "bold",
    },
    subtitle: {
      color: "#333",
    },
    button: {
      backgroundColor: "#b00020",
      mt: 2,
    },
  };
  
  export const howItWorksStyles = {
    section: {
      backgroundColor: "#f9f9f9",
      p: 4,
    },
    heading: {
      color: "#b00020",
      fontWeight: "bold",
      mb: 3,
    },
    card: {
      minHeight: "180px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      p: 2,
      borderRadius: "10px",
      transition: "transform 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
      },
    },
    stepTitle: {
      color: "#b00020",
      fontWeight: "bold",
    },
    stepDesc: {
      mt: 1,
      color: "#333",
    },
  };
  
  
  export const featuresStyles = {
    section: {
      backgroundColor: "#fff",
      p: 4,
    },
    heading: {
      color: "#b00020",
      fontWeight: "bold",
      mb: 3,
    },
    card: {
      minHeight: "350px", // instead of fixed height
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
      },
      borderRadius: "10px",
      p: 2,
    },
    imageContainer: {
      width: "100%",
      height: "140px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderRadius: "8px",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    text: {
      color: "#333",
    },
  };
  
  
  