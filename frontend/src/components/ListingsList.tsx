import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import ListingsListToolbar from "components/ListingsListToolbar";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "tokenId", headerName: "Token Id", width: 150 },
  { field: "value", headerName: "Value", width: 150 },
  { field: "author", headerName: "Author", width: 370 },
];

const parseStatusCode = (statusCode: number): string => {
  switch (statusCode) {
    case 0:
      return "None";
    case 1:
      return "Available";
    case 2:
      return "Sold";
    case 3:
      return "Removed";
    default:
      return "NA";
  }
};

interface IListingRow {
  id: string;
  author: string;
  status: string;
  tokenId: string;
  value: string;
}

const ListingsList = () => {
  const [dappState, _] = useDappContext();
  const [listings, setListings] = React.useState<IListingRow[]>([]);
  const [selected, setSelected] = React.useState<ISelectedListing[]>([]);
  const [_n, { setWarning }] = useNotificationContext();

  const getListings = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const listingCountBigNum = await marketplaceContract.listingCount();
    const listingCount = Number(listingCountBigNum.toString());
    const _listings: IListingRow[] = [];

    for (let i = 0; i < listingCount; i++) {
      const listingRes = await marketplaceContract.listings(i);
      try {
        const _listing: IListingRow = {
          id: listingRes.id.toString(),
          author: listingRes.author,
          status: parseStatusCode(listingRes.status),
          tokenId: listingRes.tokenId,
          value: listingRes.value,
        };
        _listings.push(_listing);
      } catch (err) {
        setWarning(err.message);
      }
    }

    setListings(_listings);
  };

  const handleGridStateChange = (state: any): void => {
    const selected = state.selection;
    const selectedListings: ISelectedListing[] = [];

    selected.forEach((listing) => {
      const selectedListing: ISelectedListing = {
        listingId: Number(listings[listing].id),
        status: listings[listing].status,
        tokenId: listings[listing].tokenId.toString(),
      };
      selectedListings.push(selectedListing);
    });
    setSelected(selectedListings);
  };

  React.useEffect(() => {
    if (dappState.isInitialized) getListings();
  }, [dappState]);

  return (
    <Box>
      {selected.length > 0 && <ListingsListToolbar selected={selected} />}
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          checkboxSelection={true}
          onStateChange={handleGridStateChange}
          rows={listings}
          columns={columns}
          isRowSelectable={({ row }) => row.status !== "Removed"}
        />
      </Paper>
    </Box>
  );
};

export default ListingsList;
