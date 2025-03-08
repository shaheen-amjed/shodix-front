"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const InventoryManagement = ({ products }) => {
  const handleUpdateStock = (productId, newStock) => {
    // Implement stock update logic here
    console.log(`Updating stock for product ${productId} to ${newStock}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Current Stock</TableHead>
          <TableHead>Update Stock</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.product_id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Input
                type="number"
                defaultValue={product.stock}
                onChange={(e) => handleUpdateStock(product.product_id, e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default InventoryManagement

