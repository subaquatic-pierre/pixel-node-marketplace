import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

import { HOST_URL } from "const";
import useDappContext from "hooks/useDappContext";

interface TokenIdToUri {
  tokenId: number;
  tokenUri: string;
}

interface IMarketplaceListItemProps {
  listItem: TokenIdToUri;
}

const MarketplaceListItem: React.FC<IMarketplaceListItemProps> = ({
  listItem,
}) => {
  const [item, setItem] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [dappState, _] = useDappContext();

  const loadItem = () => {
    axios
      .get(listItem.tokenUri)
      .then((res) => {
        const attrs = res.data.attributes;
        const itemRes = {
          id: res.data.tokenId,
          url: res.data.imageUrl,
          name: res.data.name,
          description: res.data.description,
          value: attrs[0].value,
          dateCreated: "somedate",
        };
        setItem(itemRes);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  React.useEffect(() => {
    if (dappState.isInitialized) {
      loadItem();
    }
  }, [dappState]);

  React.useEffect(() => {
    // console.log(item);
  }, [item]);

  return (
    <div>
      {loading && <div>loading</div>}
      {item && (
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <Link
            style={{ textDecoration: "none" }}
            to={`/marketplace/${listItem.tokenId}`}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                image={item.url}
                alt={item.name}
                height={300}
              />
            </CardActionArea>
          </Link>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {item.name}
            </Typography>
            <Typography>{item.description}</Typography>
          </CardContent>
          <CardActions sx={{ p: 2 }}>
            <Link
              style={{ textDecoration: "none" }}
              to={`/marketplace/${listItem.tokenId}`}
            >
              <Button sx={{ mr: 1 }} color="primary" variant="contained">
                View
              </Button>
            </Link>
            <Button sx={{ mr: 1 }} color="secondary" variant="contained">
              Purchase
            </Button>
          </CardActions>
        </Card>
      )}
    </div>
  );
};

export default MarketplaceListItem;
