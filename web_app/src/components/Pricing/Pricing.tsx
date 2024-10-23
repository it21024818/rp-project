import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { checkLogin } from "../../Utils/Generals";
import { useGetUserQuery } from "../../store/apiquery/usersApiSlice";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material";
import { BASE_URL } from '../../Utils/Generals';

const tiers = [
  {
    title: "FREE",
    price: "0",
    description: [
      "10 REQUESTS PER HOUR",
      "SLOWER PROCESSING",
      "LIGHTWEIGHT MODAL",
    ],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
  },
  {
    title: "PAID",
    subheader: "Recommended",
    price: "50",
    description: [
      "UNLIMITED ACCESS",
      "FASTER PROCESSING",
      "FULL SCALE MODAL",
      "PRIORITIZED FEEDBACK",
      "BEST DEALS",
    ],
    buttonText: "Sign up for Upgrade",
    buttonVariant: "contained",
  },
];

const tiersLoged = [
  {
    title: "You are Currently Using Free Plan",
    price: "0",
    description: [
      "10 REQUESTS PER HOUR",
      "SLOWER PROCESSING",
      "LIGHTWEIGHT MODAL",
    ],
    buttonText: "Upgrade Now",
    buttonVariant: "outlined",
  },
  {
    title: "PAID",
    subheader: "Recommended",
    price: "50",
    description: [
      "UNLIMITED ACCESS",
      "FASTER PROCESSING",
      "FULL SCALE MODAL",
      "PRIORITIZED FEEDBACK",
      "BEST DEALS",
    ],
    buttonText: "Start now",
    buttonVariant: "contained",
  },
];

const tiersActive = [
  {
    title: "You are Currently Using Paid Plan",
    subheader: "Recommended",
    price: "50",
    description: [
      "UNLIMITED ACCESS",
      "FASTER PROCESSING",
      "FULL SCALE MODAL",
      "PRIORITIZED FEEDBACK",
      "BEST DEALS",
    ],
    buttonText: "Start now",
    buttonVariant: "contained",
  },
];

export default function Pricing() {
  const [user, setUser] = useState<{
    _id: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  // Get user data from localStorage and then fetch it from the API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch user data using the user ID if available
  const { data: userData } = useGetUserQuery(user?._id || "", {
    skip: !user?._id, // Skip the query if userId is not available
  });

  const hasActiveSubscription =
    userData?.subscription?.STRIPE?.status === "ACTIVE";

  console.log(hasActiveSubscription);

  const [loading, setLoading] = useState(false);
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const requestBody = {
        line_items: [
          {
            price: "price_12345",
            quantity: 1,
          },
        ],
      };

      const response = await axios.post(
        `${BASE_URL}/v1/payments/stripe/checkout`,
        requestBody,
        {
          params: {
            "plan-id": "67153697ca6bb825f16486e6",
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No URL returned from the server");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        <Typography component="h2" variant="h4" color="text.primary">
          Pricing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore our powerful Lighthouse Fake News Detection product, designed
          to help you distinguish between real and fake news effortlessly. Our
          advanced algorithms and models ensure accurate and reliable results.{" "}
          <br />
          Whether you're looking for a free plan with basic features or a
          premium plan with unlimited access and faster processing, we have a
          solution tailored to your needs.
        </Typography>
      </Box>

      {!checkLogin() ? (
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === "Enterprise" ? 12 : 6}
              md={4}
            >
              <Card
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  border: tier.title === "PAID" ? "1px solid" : undefined,
                  borderColor:
                    tier.title === "PAID" ? "primary.main" : undefined,
                  background:
                    tier.title === "PAID"
                      ? "linear-gradient(#033363, #021F3B)"
                      : undefined,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: tier.title === "PAID" ? "grey.100" : "",
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {tier.title}
                    </Typography>
                    {tier.title === "PAID" && (
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label={tier.subheader}
                        size="small"
                        sx={{
                          background: (theme) =>
                            theme.palette.mode === "light" ? "" : "none",
                          backgroundColor: "primary.contrastText",
                          "& .MuiChip-label": {
                            color: "primary.dark",
                          },
                          "& .MuiChip-icon": {
                            color: "primary.dark",
                          },
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      color: tier.title === "PAID" ? "grey.50" : undefined,
                    }}
                  >
                    <Typography component="h3" variant="h2">
                      USD {tier.price}
                    </Typography>
                    <Typography component="h3" variant="h6">
                      &nbsp; per month
                    </Typography>
                  </Box>
                  <Divider
                    sx={{
                      my: 2,
                      opacity: 0.2,
                      borderColor: "grey.500",
                    }}
                  />
                  {tier.description.map((line) => (
                    <Box
                      key={line}
                      sx={{
                        py: 1,
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          width: 20,
                          color:
                            tier.title === "PAID"
                              ? "primary.light"
                              : "primary.main",
                        }}
                      />
                      <Typography
                        component="text"
                        variant="subtitle2"
                        sx={{
                          color: tier.title === "PAID" ? "grey.200" : undefined,
                        }}
                      >
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant as "outlined" | "contained"}
                    component="a"
                    href="/"
                    target="_blank"
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {hasActiveSubscription
            ? tiersActive.map((tier) => (
                <Grid
                  item
                  key={tier.title}
                  xs={12}
                  sm={tier.title === "Enterprise" ? 12 : 6}
                  md={4}
                >
                  <Card
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      border:
                        tier.title === "You are Currently Using Paid Plan"
                          ? "1px solid"
                          : undefined,
                      borderColor:
                        tier.title === "You are Currently Using Paid Plan"
                          ? "primary.main"
                          : undefined,
                      background:
                        tier.title === "You are Currently Using Paid Plan"
                          ? "linear-gradient(#033363, #021F3B)"
                          : undefined,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          mb: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color:
                            tier.title === "You are Currently Using Paid Plan"
                              ? "grey.100"
                              : "",
                        }}
                      >
                        <Typography component="h3" variant="h6">
                          {tier.title}
                        </Typography>
                        {tier.title === "You are Currently Using Paid Plan" && (
                          <Chip
                            icon={<AutoAwesomeIcon />}
                            label={tier.subheader}
                            size="small"
                            sx={{
                              background: (theme) =>
                                theme.palette.mode === "light" ? "" : "none",
                              backgroundColor: "primary.contrastText",
                              "& .MuiChip-label": {
                                color: "primary.dark",
                              },
                              "& .MuiChip-icon": {
                                color: "primary.dark",
                              },
                            }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          color:
                            tier.title === "You are Currently Using Paid Plan"
                              ? "grey.50"
                              : undefined,
                        }}
                      >
                        <Typography component="h3" variant="h2">
                          USD {tier.price}
                        </Typography>
                        <Typography component="h3" variant="h6">
                          &nbsp; per month
                        </Typography>
                      </Box>
                      <Divider
                        sx={{
                          my: 2,
                          opacity: 0.2,
                          borderColor: "grey.500",
                        }}
                      />
                      {tier.description.map((line) => (
                        <Box
                          key={line}
                          sx={{
                            py: 1,
                            display: "flex",
                            gap: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <CheckCircleRoundedIcon
                            sx={{
                              width: 20,
                              color:
                                tier.title ===
                                "You are Currently Using Paid Plan"
                                  ? "primary.light"
                                  : "primary.main",
                            }}
                          />
                          <Typography
                            component="text"
                            variant="subtitle2"
                            sx={{
                              color:
                                tier.title ===
                                "You are Currently Using Paid Plan"
                                  ? "grey.200"
                                  : undefined,
                            }}
                          >
                            {line}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : tiersLoged.map((tier) => (
                <Grid
                  item
                  key={tier.title}
                  xs={12}
                  sm={tier.title === "Enterprise" ? 12 : 6}
                  md={4}
                >
                  <Card
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      border:
                        tier.title === "You are Currently Using Free Plan"
                          ? "1px solid"
                          : undefined,
                      borderColor:
                        tier.title === "You are Currently Using Free Plan"
                          ? "primary.main"
                          : undefined,
                      background:
                        tier.title === "You are Currently Using Free Plan"
                          ? "linear-gradient(#033363, #021F3B)"
                          : undefined,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          mb: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color:
                            tier.title === "You are Currently Using Free Plan"
                              ? "grey.100"
                              : "",
                        }}
                      >
                        <Typography component="h3" variant="h6">
                          {tier.title}
                        </Typography>
                        {tier.title === "You are Currently Using Free Plan" && (
                          <Chip
                            icon={<AutoAwesomeIcon />}
                            label={tier.subheader}
                            size="small"
                            sx={{
                              background: (theme) =>
                                theme.palette.mode === "light" ? "" : "none",
                              backgroundColor: "primary.contrastText",
                              "& .MuiChip-label": {
                                color: "primary.dark",
                              },
                              "& .MuiChip-icon": {
                                color: "primary.dark",
                              },
                            }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          color:
                            tier.title === "You are Currently Using Free Plan"
                              ? "grey.50"
                              : undefined,
                        }}
                      >
                        <Typography component="h3" variant="h2">
                          USD {tier.price}
                        </Typography>
                        <Typography component="h3" variant="h6">
                          &nbsp; per month
                        </Typography>
                      </Box>
                      <Divider
                        sx={{
                          my: 2,
                          opacity: 0.2,
                          borderColor: "grey.500",
                        }}
                      />
                      {tier.description.map((line) => (
                        <Box
                          key={line}
                          sx={{
                            py: 1,
                            display: "flex",
                            gap: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <CheckCircleRoundedIcon
                            sx={{
                              width: 20,
                              color:
                                tier.title ===
                                "You are Currently Using Free Plan"
                                  ? "primary.light"
                                  : "primary.main",
                            }}
                          />
                          <Typography
                            component="text"
                            variant="subtitle2"
                            sx={{
                              color:
                                tier.title ===
                                "You are Currently Using Free Plan"
                                  ? "grey.200"
                                  : undefined,
                            }}
                          >
                            {line}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                    <CardActions>
                      {loading ? (
                        <Box
                          sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: alpha("#000", 0.5),
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 3000,
                          }}
                        >
                          <CircularProgress size={80} color="primary" />
                        </Box>
                      ) : (
                        <Button
                          fullWidth
                          variant={
                            tier.buttonVariant as "outlined" | "contained"
                          }
                          component="a"
                          onClick={handleCheckout}
                          target="_blank"
                        >
                          {tier.buttonText}
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>
      )}
    </Container>
  );
}
