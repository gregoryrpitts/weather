import Box from "@mui/material/Box";

interface IMainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FunctionComponent<IMainContainerProps> = ({ children }): React.ReactElement => {
  return (
    <Box
      component={"main"}
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100vh",
        overflow: "auto",
        border: "1px dashed red",
      }}
    >
      {children}
    </Box>
  );
};

export default MainContainer;
