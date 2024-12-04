import {useEffect, useState} from "react";
import {getAllDocument} from "../../../services/documents/api";
import DocumentCard, {
  DocumentCardSkeleton,
} from "../../../components/card/documentCard";
import {IDocument} from "../../../store/documents/type";
import {Icon} from "@iconify/react/dist/iconify.js";
import {Link} from "react-router-dom";
import ShiningButton from "../../../components/button/shiningButton";
import {RootState} from "../../../store";
import {useDispatch, useSelector} from "react-redux";
import {setTriggerFetchListDocument} from "../../../store/global/globalSlice";
import {SaveDocumentModal} from "./saveDocumentModal";
import axios from "axios";
import {GetData} from "../../../apis";
import {DecryptBasic} from "../../../utilities/hash_aes";
import {GetACookie} from "../../../utilities/cookies";
import {Enum} from "../../../config/common";

export const ListDocument = () => {
  // redux
  const globalState = useSelector((state: RootState) => state.globalSlice);
  const dispath = useDispatch();

  // state
  const [listDocuments, setListDocuments] = useState<IDocument[] | any[]>([]);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    dispath(setTriggerFetchListDocument(true));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      const response = (await GetData(
        `${import.meta.env.VITE__API_HOST}/api/documents?pId=${DecryptBasic(
          GetACookie("pid"),
          Enum.srkey
        )}`
      )) as any as any[];
      if (response) {
        setListDocuments(response);
      }
      setIsloading(false);
    };

    if (globalState.trigger.isTriggerFetchListDocument) {
      fetchData();
    }
  }, [globalState.trigger.isTriggerFetchListDocument]);

  return (
    <div>
      {/* Button */}
      <div className="flex justify-between items-center gap-3">
        <Link to={"/"}>
          <button className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-primary transition-all duration-300 ease-in-out rounded hover:pl-10 hover:pr-6 hover:bg-black group mb-10">
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ease-in-out bg-primary group-hover:h-full" />
            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-300">
              <Icon icon="mynaui:arrow-left" className="text-white w-6 h-6" />
            </span>
            <span className="relative w-full text-left transition-colors duration-300 ease-in-out text-dark group-hover:text-white underline group-hover:no-underline">
              Back To Project
            </span>
          </button>
        </Link>

        <div className="flex items-center gap-3">
          <SaveDocumentModal />

          {/* Right */}
          <div>Some Stuff Here</div>
        </div>
      </div>

      {isLoading ? (
        <div className="min-w-full w-full grid grid-cols-12 gap-4">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="col-span-12 sm:col-span-6 md:col-span-3">
              <DocumentCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          {listDocuments?.length == 0 && !isLoading ? (
            <div className="min-w-full w-full flex justify-center items-center my-56">
              <div className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-6xl font-bold w-fit mb-3">
                  No Documents found!
                </h1>
                <ShiningButton
                  icon={
                    <Icon
                      icon="ph:plus-thin"
                      className="size-8 font-bold text-white"
                    />
                  }
                  label=""
                  buttonWrapperClassName="!rounded-full"
                  buttonClassName="!rounded-full !bg-neutral-800 !text-black !px-4 !py-3"
                />
              </div>
            </div>
          ) : (
            <div className="min-w-full w-full grid grid-cols-12 gap-4">
              {listDocuments?.map((document, index) => (
                <div
                  key={document._id}
                  className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
                >
                  <DocumentCard document={document} index={index + 1} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
