import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

type MediaCardProps = {
  data: string;
};

export default function MediaCard({ data }: MediaCardProps) {
  return (
    <Card
      sx={{
        marginLeft: "20px",
        marginRight: "20px",
        marginTop: "10px",
        backgroundColor: "#F5F5F5",
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAD4C_d3004nh_n_-dTCPbsPtI7c0kyEWBmg3uMZvtXU7xbmElTMASozE&s"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Title : {data}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
    </Card>
  );
}
