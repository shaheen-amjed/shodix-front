import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CustomerInsights = () => {
  // This is a placeholder. In a real application, you'd fetch this data from your API.
  const insights = [
    { title: "New Customers", value: 120, change: "+10%" },
    { title: "Repeat Customers", value: 80, change: "+5%" },
    { title: "Average Order Value", value: "$75.50", change: "+2.5%" },
    { title: "Customer Satisfaction", value: "4.8/5", change: "+0.2" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insight.value}</div>
            <p className="text-xs text-muted-foreground">{insight.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default CustomerInsights

