from django.db import models


class MountType(models.TextChoices):
    SONY_E = "Sony E", "Sony E (FE / APS-C)"
    CANON_RF = "Canon RF", "Canon RF"
    NIKON_Z = "Nikon Z", "Nikon Z"
    FUJIFILM_X = "Fujifilm X", "Fujifilm X"
    LEICA_L = "Leica L", "Leica L-Mount Alliance"
    MICRO_FOUR_THIRDS = "Micro Four Thirds", "Micro Four Thirds (MFT)"
    FIXED_LENS = "Fixed Lens", "Fixed Lens (non-interchangeable)"
    CANON_EF = "Canon EF", "Canon EF (DSLR)"
    NIKON_F = "Nikon F", "Nikon F (DSLR)"
    SONY_A = "Sony A", "Sony A (DSLR / Minolta)"
    PENTAX_K = "Pentax K", "Pentax K"
    OTHER = "Other", "Other / Proprietary"


class LensType(models.TextChoices):
    PRIME = "prime", "Prime"
    ZOOM = "zoom", "Zoom"
    MACRO = "macro", "Macro"
    TELE = "tele", "Telephoto"
    WIDE = "wide", "Wide Angle"
    FISHEYE = "fisheye", "Fisheye"
    CINE = "cine", "Cinema / Cine"
