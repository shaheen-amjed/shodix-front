import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const RecentOrders = ({ orders, showAll = false }) => {
  const displayOrders = showAll ? orders : orders.slice(0, 5)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayOrders.map((order) => (
          <TableRow key={order.order_id}>
            <TableCell>{order.order_id}</TableCell>
            <TableCell>{order.username}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RecentOrders

