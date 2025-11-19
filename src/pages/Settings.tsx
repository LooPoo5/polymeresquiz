import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ColorPicker from '@/components/settings/ColorPicker';
import { useThemeColors } from '@/hooks/useThemeColors';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const { colors, updateColor, resetColors } = useThemeColors();

  const handleReset = () => {
    resetColors();
    toast.success('Couleurs réinitialisées aux valeurs par défaut');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground mt-1">
              Personnalisez l'apparence des questions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thème des questions</CardTitle>
          <CardDescription>
            Modifiez les couleurs utilisées pour l'affichage des questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Arrière-plans</h3>
            <ColorPicker
              label="Fond (mode édition)"
              description="Couleur de fond lors de la création/édition"
              value={colors.questionBgEdit}
              onChange={(value) => updateColor('questionBgEdit', value)}
            />
            <ColorPicker
              label="Fond (mode consultation)"
              description="Couleur de fond lors de la visualisation"
              value={colors.questionBgView}
              onChange={(value) => updateColor('questionBgView', value)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Bordures et textes</h3>
            <ColorPicker
              label="Bordure"
              description="Couleur des bordures des questions"
              value={colors.questionBorder}
              onChange={(value) => updateColor('questionBorder', value)}
            />
            <ColorPicker
              label="Texte principal"
              description="Couleur du texte des questions"
              value={colors.questionText}
              onChange={(value) => updateColor('questionText', value)}
            />
            <ColorPicker
              label="Texte secondaire"
              description="Couleur des icônes et textes secondaires"
              value={colors.questionTextMuted}
              onChange={(value) => updateColor('questionTextMuted', value)}
            />
            <ColorPicker
              label="Numéro de question"
              description="Couleur du numéro de question"
              value={colors.questionNumberText}
              onChange={(value) => updateColor('questionNumberText', value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Astuce :</strong> Les changements sont appliqués en temps réel et 
          automatiquement sauvegardés. Vous pouvez créer ou éditer un quiz pour voir 
          les changements immédiatement.
        </p>
      </div>
    </div>
  );
};

export default Settings;
