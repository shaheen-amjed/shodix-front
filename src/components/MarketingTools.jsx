import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const MarketingTools = () => {
  const tools = [
    {
      title: "Email Campaigns",
      description: "Create and send email campaigns to your customers.",
      action: "Create Campaign",
    },
    {
      title: "Social Media",
      description: "Manage your social media posts and engagement.",
      action: "Manage Social",
    },
    {
      title: "Discounts & Promotions",
      description: "Create and manage store-wide or product-specific discounts.",
      action: "Create Discount",
    },
    {
      title: "SEO Tools",
      description: "Optimize your store and products for search engines.",
      action: "Optimize SEO",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tools.map((tool, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{tool.title}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>{tool.action}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default MarketingTools

