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
    <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="data"
          className="text-[10px] md:text-xs"
          tick={{ fill: "currentColor", fontSize: 10 }}
          stroke="currentColor"
          interval="preserveStartEnd"
        />
        <YAxis
          className="text-[10px] md:text-xs"
          tick={{ fill: "currentColor", fontSize: 10 }}
          stroke="currentColor"
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#111827", fontWeight: "bold", fontSize: "12px" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Line
          type="monotone"
          dataKey="vendas"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Ingressos Vendidos"
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="receita"
          stroke="#ec4899"
          strokeWidth={2}
          name="Receita (R$)"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function EventosVendasChart({ data }: { data: EventoVendasData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300} className="md:h-[350px]">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="nome"
          angle={-45}
          textAnchor="end"
          height={80}
          className="text-[10px] md:text-xs"
          tick={{ fill: "currentColor", fontSize: 10 }}
          stroke="currentColor"
          interval={0}
        />
        <YAxis
          className="text-[10px] md:text-xs"
          tick={{ fill: "currentColor", fontSize: 10 }}
          stroke="currentColor"
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#111827", fontWeight: "bold", fontSize: "12px" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
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
    <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ forma, percent }) =>
            `${forma}: ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
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
            fontSize: "12px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
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
    <ResponsiveContainer width="100%" height={300} className="md:h-[350px]">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="mes"
          className="text-[10px] md:text-xs"
          tick={{ fill: "currentColor", fontSize: 10 }}
          stroke="currentColor"
        />
        <YAxis
          className="text-[10px] md:text-xs"
          tick={{ fill: "currentColor", fontSize: 10 }}
          stroke="currentColor"
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#111827", fontWeight: "bold", fontSize: "12px" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
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
