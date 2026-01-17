"use client";

// @ts-nocheck - Recharts tem problemas de tipos com React 18
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

interface VendasTempoData {
  data: string;
  vendas: number;
  receita: number;
}

interface EventoVendasData {
  id: string;
  nome: string;
  vendas: number;
  receita: number;
}

interface FormaPagamentoData {
  forma: string;
  quantidade: number;
  receita: number;
}

interface MesComparativoData {
  mes: string;
  vendas: number;
  receita: number;
}

export function VendasTempoChart({ data }: { data: VendasTempoData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="data"
          className="text-xs"
          tick={{ fill: "currentColor" }}
          stroke="currentColor"
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "currentColor" }}
          stroke="currentColor"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#111827", fontWeight: "bold" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="vendas"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Ingressos Vendidos"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="receita"
          stroke="#ec4899"
          strokeWidth={2}
          name="Receita (R$)"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function EventosVendasChart({ data }: { data: EventoVendasData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="nome"
          angle={-45}
          textAnchor="end"
          height={100}
          className="text-xs"
          tick={{ fill: "currentColor", fontSize: 12 }}
          stroke="currentColor"
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "currentColor" }}
          stroke="currentColor"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#111827", fontWeight: "bold" }}
        />
        <Legend />
        <Bar
          dataKey="vendas"
          fill="#8b5cf6"
          name="Ingressos Vendidos"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="receita"
          fill="#ec4899"
          name="Receita (R$)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FormasPagamentoChart({ data }: { data: FormaPagamentoData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ forma, percent }) =>
            `${forma}: ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="quantidade"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MesesComparativoChart({
  data,
}: {
  data: MesComparativoData[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="mes"
          className="text-xs"
          tick={{ fill: "currentColor" }}
          stroke="currentColor"
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "currentColor" }}
          stroke="currentColor"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#111827", fontWeight: "bold" }}
        />
        <Legend />
        <Bar
          dataKey="vendas"
          fill="#10b981"
          name="Ingressos Vendidos"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="receita"
          fill="#f59e0b"
          name="Receita (R$)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
