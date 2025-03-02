import { Enum } from "../../../config/common";
import { GetACookie } from "../../../utilities/cookies";
import { DecryptBasic } from "../../../utilities/hash_aes";
import BackToPage from "../components/backToPage";
import CustomWidgets from "./customWidgets";
import PageSelector from "./pageSelector";
import Setting from "./setting";
import WidgetTree from "./widgetTree";
import Widgets from "./widgets";

const components = {
  1: PageSelector,
  2: WidgetTree,
  3: Widgets,
  4: CustomWidgets,
  5: Setting,
};

const MenuDetail = ({ id }) => {
  const projectId = DecryptBasic(GetACookie("pid"), Enum.srkey);

  const Component = components[id];
  id;
  return (
    <div className="h-[calc(100vh)] w-[16rem] sticky top-4 flex-col gap-4 rounded-r-lg flex p-6 items-center text-[#c3c3c3] bg-[#14181b] z-[1]">
      {Component && <Component projectId={projectId} />}
      <div className="fixed bottom-0 left-[100px]">
        <BackToPage />
      </div>
    </div>
  );
};

export default MenuDetail;
