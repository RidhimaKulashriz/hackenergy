import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Github,
  CheckCircle
} from "lucide-react";
import { mockSubmissions, mockRubrics } from "@/mocks/data";
import { toast } from "@/hooks/use-toast";

export default function Judge() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");

  const submission = mockSubmissions[currentIndex];
  const rubric = mockRubrics[0];

  const handleScoreChange = (criterionId: string, value: number[]) => {
    setScores({ ...scores, [criterionId]: value[0] });
  };

  const handleSubmitScore = () => {
    toast({
      title: "Score Submitted",
      description: "Your evaluation has been recorded successfully.",
    });
    // Navigate to next submission
    if (currentIndex < mockSubmissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScores({});
      setFeedback("");
    }
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxScore = rubric.criteria.length * 10;
  const completedCriteria = Object.keys(scores).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main" className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">Judge Dashboard</h1>
            <p className="text-muted-foreground">
              Submission {currentIndex + 1} of {mockSubmissions.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              aria-label="Previous submission"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(Math.min(mockSubmissions.length - 1, currentIndex + 1))}
              disabled={currentIndex === mockSubmissions.length - 1}
              aria-label="Next submission"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submission Viewer */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-2xl">{submission.title}</CardTitle>
                <p className="text-muted-foreground">{submission.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {submission.repoLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={submission.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                  {submission.demoLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={submission.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>

                {submission.accessibilityScore && (
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm font-medium mb-1">Accessibility Score</p>
                    <p className="text-2xl font-bold text-success">
                      {submission.accessibilityScore}/100
                    </p>
                  </div>
                )}

                {submission.videoLink && (
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Video Player Placeholder</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Scoring Panel */}
          <div className="space-y-6">
            {/* Rubric */}
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Evaluation Rubric</CardTitle>
                  <Badge variant={completedCriteria === rubric.criteria.length ? "default" : "outline"}>
                    {completedCriteria}/{rubric.criteria.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {rubric.criteria.map((criterion) => (
                  <div key={criterion.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{criterion.name}</h4>
                          {scores[criterion.id] !== undefined && (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </div>
                        {criterion.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {criterion.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">
                        {scores[criterion.id] ?? 0}/{criterion.maxScore}
                      </Badge>
                    </div>

                    <Slider
                      value={[scores[criterion.id] ?? 0]}
                      onValueChange={(value) => handleScoreChange(criterion.id, value)}
                      max={criterion.maxScore}
                      step={0.5}
                      className="w-full"
                      aria-label={`Score for ${criterion.name}`}
                    />
                  </div>
                ))}

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Score</span>
                    <span className="text-primary">
                      {totalScore.toFixed(1)}/{maxScore}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Feedback (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Provide constructive feedback for the team..."
                  className="min-h-32"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  aria-label="Feedback for submission"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              onClick={handleSubmitScore}
              className="w-full"
              size="lg"
              disabled={completedCriteria < rubric.criteria.length}
            >
              Submit Evaluation
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
