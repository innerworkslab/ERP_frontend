import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card className="bg-card/30 backdrop-blur-xl border-none shadow-xl rounded-3xl transition-transform hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tracking-tight">1,240</p>
          <p className="text-xs text-green-500 mt-1">+12% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-card/30 backdrop-blur-xl border-none shadow-xl rounded-3xl transition-transform hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tracking-tight">$8,200</p>
          <p className="text-xs text-green-500 mt-1">+5.4% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-card/30 backdrop-blur-xl border-none shadow-xl rounded-3xl transition-transform hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tracking-tight">320</p>
          <p className="text-xs text-muted-foreground mt-1">
            Steady since yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
