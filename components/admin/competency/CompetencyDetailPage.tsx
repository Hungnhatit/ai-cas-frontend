"use client"
import { useEffect, useState } from "react"
import { ArrowLeft, Download, Share2, Edit2, Trash2, Calendar, Hash, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import type { Competency, Criteria } from "@/types/interfaces/model"
import { CriteriaCard } from "./CriteriaCard"
import { CompetencyStats } from "./CompetencyStats"
import { competencyService } from "@/services/competency/competencyService"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import CriteriaList from "../criteria/CriteriaList"

interface CompetencyDetailsProps {
  competency_id: number
}

const CompetencyDetails = ({ competency_id }: CompetencyDetailsProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview");
  const [competency, setCompetency] = useState<Competency | null>(null);
  const [criterias, setCriterias] = useState<Criteria[]>([]);
  console.log('COMPETENCY ID: ', competency_id);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  useEffect(() => {
    const fetchCompetency = async () => {
      try {
        const res = await competencyService.getCompetencyById(competency_id);
        console.log(res)
        if (res.success) {
          setCompetency(res.data);
          setCriterias(res.data.tieu_chi_danh_gia);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchCompetency();
  }, [competency_id]);

  console.log('COMPETENCY: ', competency);

  return (
    <div className="-mx-4 px-4 min-h-screen bg-white">
      {/* Header Navigation */}

      <div className="bg-[#232f3e] -mx-4 -mt-4 p-5">
        <h1 className="text-3xl font-bold text-white mb-2">Chi tiết khung năng lực: {competency?.ten_nang_luc}</h1>
        <p className="text-white">Xây dựng, chỉnh sửa và theo dõi các tiêu chí của mỗi khung năng lực</p>
      </div>

      {/* <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="mx-auto">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="pt-4">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 p-4 rounded-sm bg-gray-200/80">
            <p className="text-[16px]">
              <h1 className="font-bold text-lg">Mô tả chi tiết: </h1>
              {competency?.mo_ta}
            </p>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    Framework ID
                  </div>
                  <p className="text-xl font-semibold">{competency?.competency_ma_framework}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Total Criteria
                  </div>
                  <p className="text-xl font-semibold">{competency?.total_criteria}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Created Date
                  </div>
                  <p className="text-sm font-medium">{formatDate(competency?.creation_date)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge className="h-4 w-4" />
                    Status
                  </div>
                  <Badge className="w-fit">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Danh sách tiêu chí</TabsTrigger>
            <TabsTrigger value="criteria">Criteria Details</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            <TabsTrigger value="history" className="hidden md:flex">
              Lịch sử
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Competency Overview</CardTitle>
                <CardDescription>General information about this competency framework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* <CompetencyStats criteria={competency?.tieu_chi_danh_gia} /> */}
                <CriteriaList data={criterias} />


              </CardContent>
            </Card>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{competency?.total_criteria}</div>
                  <p className="text-xs text-muted-foreground mt-1">Assessment dimensions</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">100%</div>
                  <p className="text-xs text-muted-foreground mt-1">Complete framework</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">{formatDate(competency?.creation_date)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Version 1.0</p>
                </CardContent>
              </Card>
            </div> */}
          </TabsContent>

          {/* Criteria Details Tab */}
          <TabsContent value="criteria" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Assessment Criteria</CardTitle>
                <CardDescription>
                  Detailed breakdown of {competency?.total_criteria} criteria for this competency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competency?.tieu_chi_danh_gia.map((criterion, index) => (
                    <CriteriaCard key={criterion.criterion_ma_framework} criterion={criterion} index={index + 1} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Criteria Distribution</CardTitle>
                  <CardDescription>Breakdown of assessment areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competency?.tieu_chi_danh_gia.map((criterion) => (
                      <div key={criterion.criterion_ma_framework} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{criterion.competency_tent}</span>
                          <span className="text-muted-foreground">100%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Framework Statistics</CardTitle>
                  <CardDescription>Key metrics and information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Total Criteria</span>
                      <span className="font-semibold">{competency?.total_criteria}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Framework ID</span>
                      <span className="font-semibold">{competency?.competency_ma_framework}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Created Date</span>
                      <span className="font-semibold text-sm">{formatDate(competency?.creation_date)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Criteria Completion Timeline</CardTitle>
                <CardDescription>When each criterion was added to the framework</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competency?.tieu_chi_danh_gia.map((criterion) => (
                    <div
                      key={criterion.criterion_ma_framework}
                      className="flex gap-4 pb-4 border-b border-border last:border-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{criterion.competency_tent}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(criterion.creation_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Change History</CardTitle>
                <CardDescription>Track all modifications to this competency framework</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 pb-4 border-b border-border">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Framework Created</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(competency?.creation_date)}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Initial framework setup with {competency?.total_criteria} criteria
                      </p>
                    </div>
                  </div>
                  {competency?.tieu_chi_danh_gia.map((criterion) => (
                    <div
                      key={criterion.criterion_ma_framework}
                      className="flex gap-4 pb-4 border-b border-border last:border-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Criterion Added: {criterion.competency_tent}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(criterion.creation_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CompetencyDetails;