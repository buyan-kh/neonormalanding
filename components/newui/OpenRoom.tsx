import { DataPartners } from "@/components/DataPartners";
import { DeidSpecimen } from "@/components/DeidSpecimen";
import { Evaluation } from "@/components/Evaluation";

export function OpenRoom() {
  return (
    <div className="newui-room">
      <Evaluation />
      <DeidSpecimen />
      <DataPartners />
    </div>
  );
}
