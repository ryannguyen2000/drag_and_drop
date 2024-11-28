import Grid from "../../components/background/gridBackground";
import { DocumentHeader } from "./components/header";
import { ListDocument } from "./components/listDocument";

const DocumentsPage = () => {
  return (
    <div className="min-h-screen">
      <Grid
        size={120}
        color="#f1f1f1"
        style={{
          backgroundColor: "#fafafa",
        }}
        className="min-h-screen"
      >
        <div className="py-10">
          <DocumentHeader />
          <div className="container mx-auto mt-20">
            <ListDocument />
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default DocumentsPage;
