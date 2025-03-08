import type { Product, Order } from "../types/store"

export const calculateStoreStats = (products: Product[], orders: Order[]) => {
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.price * order.quantity, 0)

  // Calculate revenue data for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const revenueData = orders
    .filter((order) => new Date(order.createdAt) >= thirtyDaysAgo)
    .reduce(
      (acc, order) => {
        const date = new Date(order.createdAt).toISOString().split("T")[0]
        const revenue = order.price * order.quantity
        acc[date] = (acc[date] || 0) + revenue
        return acc
      },
      {} as Record<string, number>,
    )

  const revenueDataArray = Object.entries(revenueData).map(([date, revenue]) => ({ date, revenue }))

  return {
    stats: {
      totalRevenue,
      totalOrders,
      totalProducts,
    },
    revenueData: revenueDataArray,
  }
}

