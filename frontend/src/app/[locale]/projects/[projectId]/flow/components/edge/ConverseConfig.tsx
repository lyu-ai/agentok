import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { RiSettings4Line } from "react-icons/ri";
import ToolPanel from "./ToolPanel";
import GenericOption from "../option/Option";

const ConversePanel = ({ edgeId, data, optionsDisabled = [] }: any) => {
  const t = useTranslations("option.ConverseConfig");

  const GENERAL_OPTIONS = [
    {
      type: "text",
      name: "message",
      label: t("message"),
      placeholder: t("message-placeholder"),
      rows: 4,
    },
    {
      type: "text",
      name: "summary_prompt",
      label: t("summary-prompt"),
      placeholder: t("summary-prompt-placeholder"),
      rows: 4,
    },
    {
      type: "range",
      name: "max_turns",
      label: t("max-turns"),
      min: 0,
      max: 50,
      step: 1,
      compact: true,
    },
    {
      type: "select",
      name: "summary_method",
      label: t("summary-method"),
      compact: true,
      options: [
        { label: "Last Message", value: "last_msg" },
        { label: "Reflection with LLM", value: "reflection_with_llm" },
      ],
    },
    {
      type: "check",
      name: "enable_rag",
      label: t("enable-rag"),
      compact: true,
    },
  ];
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {GENERAL_OPTIONS.filter((o) => !optionsDisabled.includes(o.name)).map(
        (options, index) => (
          <GenericOption key={index} nodeId={edgeId} data={data} {...options} />
        )
      )}
    </div>
  );
};

const ConverseConfig = ({ edgeId, data, className, style, ...props }: any) => {
  const t = useTranslations("option.ConverseConfig");
  return (
    <Popover className="relative nodrag nowheel">
      <PopoverButton style={style} className={className}>
        <div
          className="btn btn-sm btn-circle btn-primary"
          data-tooltip-id="default-tooltip"
          data-tooltip-content={t("edge-tooltip")}
        >
          <RiSettings4Line className="w-5 h-5" />
        </div>
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: "top start", gap: 4 }}
        transition
        className="flex flex-col origin-bottom-left rounded-lg backdrop-blur-md bg-gray-700/70 shadow-box shadow-gray-700 text-base-content border border-gray-600 max-w-md p-2 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <div className="flex items-center gap-2">
          <RiSettings4Line className="w-5 h-5" />
          <div className="font-bold">{t("title")}</div>
        </div>

        <TabGroup className="w-full h-full">
          <TabList className="w-full tabs tabs-bordered">
            <Tab className="tab">{t("general")}</Tab>
            <Tab className="tab">{t("tools")}</Tab>
          </TabList>
          <TabPanels className="pt-2 w-full h-full">
            <TabPanel>
              <ConversePanel edgeId={edgeId} data={data} />
            </TabPanel>
            <TabPanel>
              <ToolPanel edgeId={edgeId} data={data} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </PopoverPanel>
    </Popover>
  );
};

export default ConverseConfig;
