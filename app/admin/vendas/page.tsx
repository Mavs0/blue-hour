import { Card, CardContent } from "@/components/ui/card";

export default function AdminVendasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Vendas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visualize e gerencie todas as vendas
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            Sistema de visualização de vendas em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
