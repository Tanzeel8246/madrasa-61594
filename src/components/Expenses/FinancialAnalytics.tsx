import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useExpenses } from "@/hooks/useExpenses";
import { useTranslation } from "react-i18next";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export const FinancialAnalytics = () => {
  const { t } = useTranslation();
  const { expenses } = useExpenses();

  // Get last 6 months for trends
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  // Process monthly trends data
  const monthlyTrends = last6Months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });

    const income = monthExpenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    
    const expense = monthExpenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      month: format(month, "MMM yyyy"),
      income,
      expense,
      net: income - expense,
    };
  });

  // Category-wise breakdown
  const categoryData = expenses.reduce((acc, exp) => {
    const key = `${exp.category}-${exp.type}`;
    if (!acc[key]) {
      acc[key] = {
        category: exp.category,
        type: exp.type,
        amount: 0,
      };
    }
    acc[key].amount += Number(exp.amount);
    return acc;
  }, {} as Record<string, { category: string; type: string; amount: number }>);

  const incomeByCategoryData = Object.values(categoryData)
    .filter((d) => d.type === "income")
    .sort((a, b) => b.amount - a.amount);

  const expenseByCategoryData = Object.values(categoryData)
    .filter((d) => d.type === "expense")
    .sort((a, b) => b.amount - a.amount);

  // Monthly comparison (current vs previous month)
  const currentMonth = new Date();
  const previousMonth = subMonths(currentMonth, 1);

  const getMonthData = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });

    const income = monthExpenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    
    const expense = monthExpenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return { income, expense };
  };

  const currentMonthData = getMonthData(currentMonth);
  const previousMonthData = getMonthData(previousMonth);

  const monthlyComparison = [
    {
      month: format(previousMonth, "MMM yyyy"),
      income: previousMonthData.income,
      expense: previousMonthData.expense,
    },
    {
      month: format(currentMonth, "MMM yyyy"),
      income: currentMonthData.income,
      expense: currentMonthData.expense,
    },
  ];

  const chartConfig = {
    income: {
      label: t("expenses.income"),
      color: "hsl(var(--chart-1))",
    },
    expense: {
      label: t("expenses.expense"),
      color: "hsl(var(--chart-2))",
    },
    net: {
      label: t("expenses.net"),
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("expenses.analytics.trends")}
          </CardTitle>
          <CardDescription>
            {t("expenses.analytics.trendsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="var(--color-income)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="var(--color-expense)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="var(--color-net)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t("expenses.analytics.monthlyComparison")}
          </CardTitle>
          <CardDescription>
            {t("expenses.analytics.monthlyComparisonDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-green-600" />
              {t("expenses.analytics.incomeByCategory")}
            </CardTitle>
            <CardDescription>
              {t("expenses.analytics.categoryBreakdown")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {incomeByCategoryData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={incomeByCategoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.category}: ${entry.amount.toLocaleString()}`}
                  >
                    {incomeByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                {t("expenses.analytics.noData")}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              {t("expenses.analytics.expenseByCategory")}
            </CardTitle>
            <CardDescription>
              {t("expenses.analytics.categoryBreakdown")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenseByCategoryData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={expenseByCategoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.category}: ${entry.amount.toLocaleString()}`}
                  >
                    {expenseByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                {t("expenses.analytics.noData")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
