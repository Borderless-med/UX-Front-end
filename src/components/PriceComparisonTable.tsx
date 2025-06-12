
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ProcedureData {
  procedure: string;
  sgPrice: string;
  jbPrice: string;
  savings: string;
  percentage: string;
}

interface PriceComparisonTableProps {
  procedures: ProcedureData[];
}

const PriceComparisonTable = ({ procedures }: PriceComparisonTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-blue-light/30 hover:bg-blue-light/30">
          <TableHead className="font-semibold text-blue-dark">Procedure</TableHead>
          <TableHead className="font-semibold text-blue-dark">SG Private Range (S$)</TableHead>
          <TableHead className="font-semibold text-blue-dark">JB Range (S$)</TableHead>
          <TableHead className="font-semibold text-blue-dark">Dollar Savings (S$)</TableHead>
          <TableHead className="font-semibold text-blue-dark">% Savings (approx.)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {procedures.map((item, index) => (
          <TableRow key={index} className="hover:bg-blue-light/20 transition-colors">
            <TableCell className="font-medium text-blue-dark py-4">{item.procedure}</TableCell>
            <TableCell className="text-neutral-gray py-4">{item.sgPrice}</TableCell>
            <TableCell className="text-success-green font-medium py-4">{item.jbPrice}</TableCell>
            <TableCell className="text-success-green font-medium py-4">{item.savings}</TableCell>
            <TableCell className="py-4">
              <Badge variant="secondary" className="bg-success-green/20 text-success-green font-semibold">
                {item.percentage}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PriceComparisonTable;
