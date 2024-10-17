import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Hero from "../../components/Extention/Extention";
import Highlights from "../../components/Highlight/Highlights";
import Pricing from "../../components/Pricing/Pricing";
import Features from "../../components/Features/Features";
import FAQ from "../../components/FAQ/FAQ";
import CheckoutPage from "../../components/CheckOut/CheckoutPage";

export default function LandingPage() {
  return (
    <>
      <CssBaseline />
      <Hero />
      <Box sx={{ bgcolor: "background.default" }}>
        <Divider />
        <Features />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <CheckoutPage />
        <Divider />
        <FAQ />
        <Divider />
      </Box>
    </>
  );
}
