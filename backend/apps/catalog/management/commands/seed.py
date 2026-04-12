"""
Management command: python manage.py seed
Populates the database with realistic dummy cameras, specs, users and reviews.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

from apps.catalog.models import Brand, Camera, Lens
from apps.specs.models import (
    SensorSpec, VideoSpec, BodySpec, AutofocusSpec, ConnectivitySpec,
)
from apps.reviews.models import Review

User = get_user_model()

BRANDS = [
    {"name": "Sony",  "country": "Japan", "official_website": "https://www.sony.com"},
    {"name": "Canon", "country": "Japan", "official_website": "https://www.canon.com"},
    {"name": "Nikon", "country": "Japan", "official_website": "https://www.nikon.com"},
    {"name": "Fujifilm", "country": "Japan", "official_website": "https://www.fujifilm.com"},
    {"name": "Panasonic", "country": "Japan", "official_website": "https://www.panasonic.com"},
]

# Each entry: (brand_name, model_name, category, mount, msrp, summary, sensor, video, body, af, conn, series, pros, cons)
CAMERAS = [
    (
        "Sony", "A7 IV", "mirrorless", "Sony E", 2499,
        "A well-rounded full-frame mirrorless for stills and video shooters.",
        dict(sensor_type="BSI-CMOS", sensor_format="Full Frame", sensor_width_mm=35.9, sensor_height_mm=24.0,
             effective_mp=33.0, max_photo_resolution="7008×4672",
             native_iso_min=100, native_iso_max=51200, extended_iso_max=204800, ibis=True, ibis_stops=5.5),
        dict(max_video_resolution="4K", max_4k_fps=30, max_fhd_fps=120, high_speed_video_fps=120,
             raw_video=False, internal_10bit=True, unlimited_recording=True, digital_is=True,
             lens_breathing_correction=True, log_profiles="S-Log3, S-Log2", mic_in=True,
             headphone_out=True, hdmi_type="Full", usb_streaming=True),
        dict(weight_g=658, width_mm=131.3, height_mm=96.4, depth_mm=79.8,
             weather_sealed=True, battery_shots_cipa=520, articulating_screen=True,
             touchscreen=True, screen_size_inches=3.0, screen_resolution_kdots=1440,
             evf=True, evf_resolution="9440k dots", evf_coverage_pct=100.0, evf_magnification=0.78,
             dual_card_slots=True, built_in_flash=False,
             max_shutter_mech="1/8000s", max_shutter_electronic="1/8000s", max_flash_sync="1/250s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=False,
             ae_bracketing=True, wb_bracketing=True, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=False, af_touch=True, af_points=759,
             af_coverage_pct=94.0, eye_af_human=True, face_detection=True, eye_af_animal=True,
             subject_tracking=True, vehicle_tracking=True, insect_tracking=True,
             min_focus_ev=-4.0, burst_fps_mech=10.0, burst_fps_electronic=10.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=True,
             ethernet=False, flash_sync_port=False, full_size_hdmi=True),
        "A7",
        "Excellent autofocus system\nGreat dynamic range for landscapes\nDual card slots for professionals\n10-bit S-Log3 internal recording\nFull-size HDMI out",
        "Complex Sony menu system\nNo 4K/60p in full-frame without crop\nHeavier than APS-C alternatives\nBattery life average for the class",
    ),
    (
        "Sony", "A6700", "mirrorless", "Sony E", 1399,
        "Sony's flagship APS-C mirrorless with AI-powered autofocus.",
        dict(sensor_type="BSI-CMOS", sensor_format="APS-C", sensor_width_mm=23.5, sensor_height_mm=15.6,
             effective_mp=26.0, max_photo_resolution="6192×4128",
             native_iso_min=100, native_iso_max=32000, extended_iso_max=102400, ibis=True, ibis_stops=5.0),
        dict(max_video_resolution="4K", max_4k_fps=120, max_fhd_fps=240, high_speed_video_fps=240,
             raw_video=False, internal_10bit=True, unlimited_recording=True, digital_is=True,
             lens_breathing_correction=True, log_profiles="S-Log3, S-Log2, HLG", mic_in=True,
             headphone_out=False, hdmi_type="Micro", usb_streaming=True),
        dict(weight_g=493, width_mm=122.0, height_mm=69.0, depth_mm=75.1,
             weather_sealed=True, battery_shots_cipa=490, articulating_screen=True,
             touchscreen=True, screen_size_inches=3.0, screen_resolution_kdots=1040,
             evf=True, evf_resolution="2360k dots", evf_coverage_pct=100.0, evf_magnification=0.70,
             dual_card_slots=False, built_in_flash=False,
             max_shutter_mech="1/4000s", max_shutter_electronic="1/8000s", max_flash_sync="1/160s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=False,
             ae_bracketing=True, wb_bracketing=True, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=False, af_touch=True, af_points=759,
             af_coverage_pct=100.0, eye_af_human=True, face_detection=True, eye_af_animal=True,
             subject_tracking=True, vehicle_tracking=True, insect_tracking=True,
             min_focus_ev=-4.0, burst_fps_mech=11.0, burst_fps_electronic=11.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=True,
             ethernet=False, flash_sync_port=False, full_size_hdmi=False),
        "A6",
        "AI-powered autofocus that tracks any subject\n4K/120fps — best-in-class APS-C video\nCompact and lightweight body\nWeather sealing for outdoor shoots\nLens breathing correction",
        "No headphone port\nSingle card slot only\nNo full-size HDMI\nMenu system can be complex for beginners",
    ),
    (
        "Canon", "EOS R6 Mark II", "mirrorless", "Canon RF", 2499,
        "Speed and autofocus king among Canon full-frame mirrorless cameras.",
        dict(sensor_type="CMOS", sensor_format="Full Frame", sensor_width_mm=35.9, sensor_height_mm=23.9,
             effective_mp=24.2, max_photo_resolution="6000×4000",
             native_iso_min=100, native_iso_max=102400, extended_iso_max=204800, ibis=True, ibis_stops=8.0),
        dict(max_video_resolution="4K", max_4k_fps=60, max_fhd_fps=180, high_speed_video_fps=180,
             raw_video=False, internal_10bit=True, unlimited_recording=True, digital_is=True,
             lens_breathing_correction=False, log_profiles="Canon Log 3, Canon Log", mic_in=True,
             headphone_out=True, hdmi_type="Micro", usb_streaming=True),
        dict(weight_g=670, width_mm=138.4, height_mm=98.4, depth_mm=88.4,
             weather_sealed=True, battery_shots_cipa=760, articulating_screen=True,
             touchscreen=True, screen_size_inches=3.0, screen_resolution_kdots=1620,
             evf=True, evf_resolution="3690k dots", evf_coverage_pct=100.0, evf_magnification=0.76,
             dual_card_slots=True, built_in_flash=False,
             max_shutter_mech="1/8000s", max_shutter_electronic="1/8000s", max_flash_sync="1/160s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=True,
             ae_bracketing=True, wb_bracketing=True, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=False, af_touch=True, af_points=1053,
             af_coverage_pct=100.0, eye_af_human=True, face_detection=True, eye_af_animal=True,
             subject_tracking=True, vehicle_tracking=True, insect_tracking=False,
             min_focus_ev=-6.5, burst_fps_mech=12.0, burst_fps_electronic=40.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=True,
             ethernet=False, flash_sync_port=False, full_size_hdmi=False),
        "EOS R",
        "Industry-leading 40fps electronic burst\n8-stop IBIS — best in class\nExcellent AF at -6.5EV in near darkness\nUnlimited 4K/60p recording\nOutstanding battery life (760 shots)",
        "Only 24MP — lower resolution than rivals\nNo 4K/120fps full-frame\nMicro HDMI instead of full-size\nNo lens breathing correction",
    ),
    (
        "Canon", "EOS R50", "mirrorless", "Canon RF", 699,
        "Compact and beginner-friendly APS-C mirrorless from Canon.",
        dict(sensor_type="CMOS", sensor_format="APS-C", sensor_width_mm=22.3, sensor_height_mm=14.9,
             effective_mp=24.2, max_photo_resolution="6000×4000",
             native_iso_min=100, native_iso_max=32000, extended_iso_max=51200, ibis=False, ibis_stops=None),
        dict(max_video_resolution="4K", max_4k_fps=30, max_fhd_fps=120, high_speed_video_fps=120,
             raw_video=False, internal_10bit=False, unlimited_recording=False, digital_is=True,
             lens_breathing_correction=False, log_profiles="", mic_in=False, headphone_out=False,
             hdmi_type="Micro", usb_streaming=True),
        dict(weight_g=375, width_mm=116.3, height_mm=85.5, depth_mm=68.8,
             weather_sealed=False, battery_shots_cipa=300, articulating_screen=True,
             touchscreen=True, screen_size_inches=3.0, screen_resolution_kdots=1040,
             evf=False, evf_resolution="", evf_coverage_pct=None, evf_magnification=None,
             dual_card_slots=False, built_in_flash=True,
             max_shutter_mech="1/4000s", max_shutter_electronic="1/16000s", max_flash_sync="1/200s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=True,
             ae_bracketing=True, wb_bracketing=False, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=False, af_touch=True, af_points=651,
             af_coverage_pct=100.0, eye_af_human=True, face_detection=True, eye_af_animal=True,
             subject_tracking=True, vehicle_tracking=False, insect_tracking=False,
             min_focus_ev=-4.0, burst_fps_mech=15.0, burst_fps_electronic=15.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=True,
             ethernet=False, flash_sync_port=False, full_size_hdmi=False),
        "EOS R",
        "Very compact and lightweight (375g)\nExcellent Canon Dual Pixel AF\nBuilt-in flash for events\nGreat value at entry-level price\nFully articulating touchscreen",
        "No weather sealing\nNo electronic viewfinder (EVF)\nNo 10-bit video recording\nSingle UHS-I card slot\nNo mic/headphone ports",
    ),
    (
        "Nikon", "Z8", "mirrorless", "Nikon Z", 3999,
        "Professional-grade full-frame mirrorless without a mechanical shutter.",
        dict(sensor_type="Stacked BSI-CMOS", sensor_format="Full Frame", sensor_width_mm=35.9, sensor_height_mm=23.9,
             effective_mp=45.7, max_photo_resolution="8256×5504",
             native_iso_min=64, native_iso_max=25600, extended_iso_max=102400, ibis=True, ibis_stops=6.0),
        dict(max_video_resolution="8K", max_4k_fps=120, max_fhd_fps=240, high_speed_video_fps=240,
             raw_video=True, internal_10bit=True, unlimited_recording=True, digital_is=True,
             lens_breathing_correction=True, log_profiles="N-Log, HLG", mic_in=True,
             headphone_out=True, hdmi_type="Full", usb_streaming=True),
        dict(weight_g=820, width_mm=144.0, height_mm=118.5, depth_mm=83.0,
             weather_sealed=True, battery_shots_cipa=340, articulating_screen=True,
             touchscreen=True, screen_size_inches=3.2, screen_resolution_kdots=2100,
             evf=True, evf_resolution="3690k dots", evf_coverage_pct=100.0, evf_magnification=0.80,
             dual_card_slots=True, built_in_flash=False,
             max_shutter_mech="None", max_shutter_electronic="1/32000s", max_flash_sync="1/200s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=False,
             ae_bracketing=True, wb_bracketing=True, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=False, af_touch=True, af_points=493,
             af_coverage_pct=100.0, eye_af_human=True, face_detection=True, eye_af_animal=True,
             subject_tracking=True, vehicle_tracking=True, insect_tracking=True,
             min_focus_ev=-9.0, burst_fps_mech=None, burst_fps_electronic=20.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=True,
             ethernet=False, flash_sync_port=True, full_size_hdmi=True),
        "Z",
        "45MP stacked BSI sensor — studio-grade resolution\n8K RAW internal recording\nFull-size HDMI + Flash sync port\nNo blackout burst shooting\nExcellent build quality and weather sealing",
        "Very expensive at MSRP\nLarger and heavier than most mirrorless\nBattery life below expectation for the class\nNo mechanical shutter backup",
    ),
    (
        "Nikon", "Z30", "mirrorless", "Nikon Z", 759,
        "Compact vlogging-focused APS-C mirrorless — no EVF, great video.",
        dict(sensor_type="CMOS", sensor_format="APS-C", sensor_width_mm=23.5, sensor_height_mm=15.7,
             effective_mp=20.9, max_photo_resolution="5568×3712",
             native_iso_min=100, native_iso_max=51200, extended_iso_max=204800, ibis=False, ibis_stops=None),
        dict(max_video_resolution="4K", max_4k_fps=30, max_fhd_fps=120, high_speed_video_fps=120,
             raw_video=False, internal_10bit=False, unlimited_recording=False, digital_is=True,
             lens_breathing_correction=False, log_profiles="N-Log", mic_in=True,
             headphone_out=False, hdmi_type="Micro", usb_streaming=True),
        dict(weight_g=405, width_mm=128.0, height_mm=73.5, depth_mm=59.5,
             weather_sealed=False, battery_shots_cipa=300, articulating_screen=True,
             touchscreen=True, screen_size_inches=3.0, screen_resolution_kdots=1040,
             evf=False, evf_resolution="", evf_coverage_pct=None, evf_magnification=None,
             dual_card_slots=False, built_in_flash=False,
             max_shutter_mech="1/4000s", max_shutter_electronic="1/2000s", max_flash_sync="1/160s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=False,
             ae_bracketing=True, wb_bracketing=True, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=False, af_touch=True, af_points=209,
             af_coverage_pct=90.0, eye_af_human=True, face_detection=True, eye_af_animal=False,
             subject_tracking=True, vehicle_tracking=False, insect_tracking=False,
             min_focus_ev=-4.0, burst_fps_mech=11.0, burst_fps_electronic=11.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=True,
             ethernet=False, flash_sync_port=False, full_size_hdmi=False),
        "Z",
        "Ultra-compact and lightweight for vlogging\nMic input for better audio\nFully articulating screen\nExcellent N-Log for color grading\nGood USB streaming for live content",
        "No EVF — screen only\nNo weather sealing\nNo headphone port\nSingle card slot\nNo in-body stabilization",
    ),
    (
        "Fujifilm", "X-T5", "mirrorless", "Fujifilm X", 1699,
        "High-resolution 40MP APS-C mirrorless with classic Fujifilm handling.",
        dict(sensor_type="BSI-CMOS", sensor_format="APS-C", sensor_width_mm=23.5, sensor_height_mm=15.6,
             effective_mp=40.2, max_photo_resolution="7728×5152",
             native_iso_min=125, native_iso_max=12800, extended_iso_max=51200, ibis=True, ibis_stops=7.0),
        dict(max_video_resolution="4K", max_4k_fps=30, max_fhd_fps=240, high_speed_video_fps=240,
             raw_video=False, internal_10bit=True, unlimited_recording=False, digital_is=False,
             lens_breathing_correction=False, log_profiles="F-Log, F-Log2", mic_in=True,
             headphone_out=True, hdmi_type="Micro", usb_streaming=False),
        dict(weight_g=557, width_mm=129.5, height_mm=91.1, depth_mm=63.8,
             weather_sealed=True, battery_shots_cipa=580, articulating_screen=False,
             touchscreen=True, screen_size_inches=3.0, screen_resolution_kdots=1620,
             evf=True, evf_resolution="3690k dots", evf_coverage_pct=100.0, evf_magnification=0.80,
             dual_card_slots=True, built_in_flash=False,
             max_shutter_mech="1/8000s", max_shutter_electronic="1/180000s", max_flash_sync="1/250s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=False,
             ae_bracketing=True, wb_bracketing=True, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=True, af_touch=True, af_points=425,
             af_coverage_pct=100.0, eye_af_human=True, face_detection=True, eye_af_animal=True,
             subject_tracking=True, vehicle_tracking=False, insect_tracking=False,
             min_focus_ev=-7.0, burst_fps_mech=15.0, burst_fps_electronic=20.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=False,
             ethernet=False, flash_sync_port=True, full_size_hdmi=False),
        "X-T",
        "40MP sensor resolution rivals many full-frame cameras\nExceptional Fujifilm film simulations\nWeather sealed with classic dials\nDual card slots\nExcellent battery life (580 shots)",
        "Rear screen does not fully articulate\nVideo capped at 4K/30p (no 4K/60p)\nNo USB streaming or webcam mode\nNo digital IS for video",
    ),
    (
        "Fujifilm", "X100VI", "compact", "Fixed Lens", 1599,
        "Iconic fixed-lens compact with 40MP sensor and built-in ND filter.",
        dict(sensor_type="BSI-CMOS", sensor_format="APS-C", sensor_width_mm=23.5, sensor_height_mm=15.6,
             effective_mp=40.2, max_photo_resolution="7728×5152",
             native_iso_min=125, native_iso_max=12800, extended_iso_max=51200, ibis=True, ibis_stops=6.0),
        dict(max_video_resolution="4K", max_4k_fps=30, max_fhd_fps=120, high_speed_video_fps=120,
             raw_video=False, internal_10bit=True, unlimited_recording=False, digital_is=False,
             lens_breathing_correction=False, log_profiles="F-Log, F-Log2", mic_in=True,
             headphone_out=True, hdmi_type="Micro", usb_streaming=False),
        dict(weight_g=521, width_mm=128.0, height_mm=74.8, depth_mm=55.3,
             weather_sealed=True, battery_shots_cipa=450, articulating_screen=False,
             touchscreen=True, screen_size_inches=3.0, screen_resolution_kdots=1620,
             evf=True, evf_resolution="3690k dots", evf_coverage_pct=100.0, evf_magnification=0.52,
             dual_card_slots=False, built_in_flash=True,
             max_shutter_mech="1/4000s", max_shutter_electronic="1/32000s", max_flash_sync="1/2000s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=False,
             ae_bracketing=True, wb_bracketing=True, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=True, af_touch=True, af_points=425,
             af_coverage_pct=100.0, eye_af_human=True, face_detection=True, eye_af_animal=True,
             subject_tracking=True, vehicle_tracking=False, insect_tracking=False,
             min_focus_ev=-7.0, burst_fps_mech=15.0, burst_fps_electronic=20.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=False,
             ethernet=False, flash_sync_port=False, full_size_hdmi=False),
        "X100",
        "Iconic retro design that fits in a jacket pocket\n40MP APS-C sensor with film simulations\nWeather sealed body\nBuilt-in ND filter — unique feature\nHybrid OVF/EVF viewfinder",
        "Fixed 23mm f/2 lens — no zoom or change\nHard to find in stock\nNo articulating screen\nNo USB streaming",
    ),
    (
        "Panasonic", "Lumix S5 II", "mirrorless", "Leica L", 1999,
        "First Panasonic mirrorless with phase-detect AF and 6K video capability.",
        dict(sensor_type="BSI-CMOS", sensor_format="Full Frame", sensor_width_mm=35.6, sensor_height_mm=23.8,
             effective_mp=24.2, max_photo_resolution="6000×4000",
             native_iso_min=100, native_iso_max=51200, extended_iso_max=204800, ibis=True, ibis_stops=6.5),
        dict(max_video_resolution="6K", max_4k_fps=60, max_fhd_fps=180, high_speed_video_fps=180,
             raw_video=False, internal_10bit=True, unlimited_recording=True, digital_is=True,
             lens_breathing_correction=False, log_profiles="V-Log, HLG", mic_in=True,
             headphone_out=True, hdmi_type="Full", usb_streaming=True),
        dict(weight_g=740, width_mm=134.3, height_mm=102.3, depth_mm=90.1,
             weather_sealed=True, battery_shots_cipa=370, articulating_screen=True,
             touchscreen=True, screen_size_inches=3.0, screen_resolution_kdots=1840,
             evf=True, evf_resolution="3680k dots", evf_coverage_pct=100.0, evf_magnification=0.74,
             dual_card_slots=True, built_in_flash=False,
             max_shutter_mech="1/8000s", max_shutter_electronic="1/8000s", max_flash_sync="1/250s",
             metering_multi_segment=True, metering_spot=True, metering_center_weighted=True, metering_partial=False,
             ae_bracketing=True, wb_bracketing=True, timelapse=True, gps=False),
        dict(phase_detect=True, af_contrast_detect=False, af_touch=True, af_points=779,
             af_coverage_pct=100.0, eye_af_human=True, face_detection=True, eye_af_animal=True,
             subject_tracking=True, vehicle_tracking=False, insect_tracking=False,
             min_focus_ev=-6.0, burst_fps_mech=9.0, burst_fps_electronic=30.0),
        dict(wifi=True, bluetooth=True, usb_c=True, usb_charging=True, webcam_mode=True,
             ethernet=False, flash_sync_port=False, full_size_hdmi=True),
        "Lumix S",
        "V-Log included standard — no extra cost\nFull-size HDMI output\nExcellent 6.5-stop IBIS\nPhase-detect AF — finally reliable\nUnlimited recording in all modes",
        "Heavier than most full-frame competitors\nEVF resolution is only average\nNo RAW video output\nLeica L lens ecosystem is smaller",
    ),
]

LENSES = [
    # (mount, name, focal_length, max_aperture, lens_type, official_url)
    # Canon RF
    ("Canon RF", "RF 24-70mm f/2.8L IS USM", "24-70mm", "f/2.8", "zoom", "https://www.canon.com"),
    ("Canon RF", "RF 85mm f/1.2L USM", "85mm", "f/1.2", "prime", "https://www.canon.com"),
    ("Canon RF", "RF 50mm f/1.8 STM", "50mm", "f/1.8", "prime", "https://www.canon.com"),
    ("Canon RF", "RF 15-35mm f/2.8L IS USM", "15-35mm", "f/2.8", "zoom", "https://www.canon.com"),
    ("Canon RF", "RF 100-500mm f/4.5-7.1L IS USM", "100-500mm", "f/4.5-7.1", "tele", "https://www.canon.com"),
    ("Canon RF", "RF 35mm f/1.8 IS STM Macro", "35mm", "f/1.8", "macro", "https://www.canon.com"),
    # Sony E
    ("Sony E", "FE 24-70mm f/2.8 GM II", "24-70mm", "f/2.8", "zoom", "https://www.sony.com"),
    ("Sony E", "FE 85mm f/1.4 GM", "85mm", "f/1.4", "prime", "https://www.sony.com"),
    ("Sony E", "FE 50mm f/1.2 GM", "50mm", "f/1.2", "prime", "https://www.sony.com"),
    ("Sony E", "FE 70-200mm f/2.8 GM OSS II", "70-200mm", "f/2.8", "tele", "https://www.sony.com"),
    ("Sony E", "FE 16-35mm f/2.8 GM II", "16-35mm", "f/2.8", "zoom", "https://www.sony.com"),
    ("Sony E", "FE 90mm f/2.8 Macro G OSS", "90mm", "f/2.8", "macro", "https://www.sony.com"),
    # Nikon Z
    ("Nikon Z", "Z 24-70mm f/2.8 S", "24-70mm", "f/2.8", "zoom", "https://www.nikon.com"),
    ("Nikon Z", "Z 50mm f/1.8 S", "50mm", "f/1.8", "prime", "https://www.nikon.com"),
    ("Nikon Z", "Z 85mm f/1.8 S", "85mm", "f/1.8", "prime", "https://www.nikon.com"),
    ("Nikon Z", "Z 70-200mm f/2.8 VR S", "70-200mm", "f/2.8", "tele", "https://www.nikon.com"),
    ("Nikon Z", "Z 14-30mm f/4 S", "14-30mm", "f/4", "zoom", "https://www.nikon.com"),
    ("Nikon Z", "Z MC 105mm f/2.8 VR S", "105mm", "f/2.8", "macro", "https://www.nikon.com"),
    # Fujifilm X
    ("Fujifilm X", "XF 23mm f/1.4 R LM WR", "23mm", "f/1.4", "prime", "https://www.fujifilm.com"),
    ("Fujifilm X", "XF 56mm f/1.2 R WR", "56mm", "f/1.2", "prime", "https://www.fujifilm.com"),
    ("Fujifilm X", "XF 18-55mm f/2.8-4 R LM OIS", "18-55mm", "f/2.8-4", "zoom", "https://www.fujifilm.com"),
    ("Fujifilm X", "XF 100-400mm f/4.5-5.6 R LM OIS WR", "100-400mm", "f/4.5-5.6", "tele", "https://www.fujifilm.com"),
    ("Fujifilm X", "XF 16mm f/1.4 R WR", "16mm", "f/1.4", "prime", "https://www.fujifilm.com"),
    ("Fujifilm X", "XF 80mm f/2.8 R LM OIS WR Macro", "80mm", "f/2.8", "macro", "https://www.fujifilm.com"),
    # Leica L
    ("Leica L", "Lumix S 24-70mm f/2.8", "24-70mm", "f/2.8", "zoom", "https://www.panasonic.com"),
    ("Leica L", "Lumix S 85mm f/1.8", "85mm", "f/1.8", "prime", "https://www.panasonic.com"),
    ("Leica L", "Sigma 24-70mm f/2.8 DG DN Art", "24-70mm", "f/2.8", "zoom", "https://www.sigma-global.com"),
    ("Leica L", "Sigma 35mm f/1.4 DG DN Art", "35mm", "f/1.4", "prime", "https://www.sigma-global.com"),
    ("Leica L", "Lumix S 70-300mm f/4.5-5.6 Macro OIS", "70-300mm", "f/4.5-5.6", "tele", "https://www.panasonic.com"),
]

USERS = [
    {"username": "pro_videographer", "email": "video@example.com", "password": "testpass123"},
    {"username": "gear_reviewer",    "email": "gear@example.com",  "password": "testpass123"},
]

REVIEWS = [
    # (username, camera_model, title, body, pros, cons, ratings, usage, experience, ownership)
    (
        "photo_enthusiast", "A7 IV",
        "The best do-it-all full-frame available",
        "I've been shooting with the Sony A7 IV for over a year now, primarily for portrait and landscape photography. " * 5,
        "Excellent autofocus, great dynamic range, dual card slots",
        "Menu system is complex, battery life could be better",
        (9, 9, 8, 8), "travel", "enthusiast", "owned",
    ),
    (
        "pro_videographer", "A7 IV",
        "Outstanding video hybrid for the price",
        "As a working videographer the A7 IV ticks almost every box. The 10-bit S-Log3 footage grades beautifully. " * 5,
        "10-bit internal recording, S-Log3, great lowlight",
        "No 4K/60p in full-frame mode without crop",
        (8, 7, 9, 8), "vlogging", "pro", "owned",
    ),
    (
        "gear_reviewer", "EOS R6 Mark II",
        "Speed demon — perfect for wildlife and sports",
        "The R6 Mark II is Canon's best mirrorless to date. 40fps electronic shutter and the AF simply never misses. " * 5,
        "Blazing fast AF, 40fps e-shutter, excellent IBIS",
        "Resolution is modest at 24MP for landscape shooters",
        (9, 8, 9, 8), "wildlife", "pro", "tested",
    ),
    (
        "photo_enthusiast", "X-T5",
        "A film photographer's digital dream",
        "The X-T5 pairs Fujifilm's legendary film simulations with a 40MP sensor that beats many full-frame cameras. " * 5,
        "40MP sensor, film simulations, weather sealed, compact",
        "Rear screen doesn't fully articulate, video is not the priority",
        (9, 9, 7, 9), "studio", "enthusiast", "owned",
    ),
    (
        "pro_videographer", "Lumix S5 II",
        "Panasonic finally cracked phase-detect AF",
        "The S5 II fixed the one complaint everyone had about Panasonic — AF. Now it's class-leading video + reliable AF. " * 5,
        "V-Log, reliable PDAF, full-size HDMI, excellent IBIS",
        "Heavier than competitors, EVF resolution is average",
        (8, 8, 9, 9), "cinema", "pro", "owned",
    ),
    (
        "gear_reviewer", "Z8",
        "Nikon's finest mirrorless — a Z9 without the bulk",
        "The Z8 packs every feature from the Z9 into a smaller body at a lower price. 8K RAW, 45MP, no mechanical shutter needed. " * 5,
        "8K RAW, stacked sensor, no blackout, superb build",
        "Expensive, large for a travel camera",
        (10, 10, 10, 8), "studio", "pro", "owned",
    ),
]


class Command(BaseCommand):
    help = "Seed the database with dummy brands, cameras, specs and reviews"

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Delete existing seed data first")

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            Review.objects.all().delete()
            Camera.objects.all().delete()
            Brand.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

        # --- Brands ---
        brand_map = {}
        for b in BRANDS:
            obj, created = Brand.objects.get_or_create(name=b["name"], defaults=b)
            brand_map[b["name"]] = obj
            self.stdout.write(f"  {'Created' if created else 'Exists'} brand: {obj.name}")

        # --- Cameras + Specs ---
        camera_map = {}
        for (brand_name, model_name, category, mount, msrp, summary,
             sensor, video, body, af, conn, series, pros, cons) in CAMERAS:

            brand = brand_map[brand_name]
            camera, created = Camera.objects.get_or_create(
                brand=brand, model_name=model_name,
                defaults=dict(
                    category=category, mount=mount, msrp=msrp,
                    current_price_estimate=msrp, short_summary=summary,
                    series=series, pros=pros, cons=cons,
                    status="active", release_date="2023-01-01",
                    official_url=f"https://www.{brand_name.lower()}.com",
                ),
            )
            camera_map[model_name] = camera
            self.stdout.write(f"  {'Created' if created else 'Exists'} camera: {camera.full_name}")

            if created:
                SensorSpec.objects.create(camera=camera, **sensor)
                VideoSpec.objects.create(camera=camera, **video)
                BodySpec.objects.create(camera=camera, **body)
                AutofocusSpec.objects.create(camera=camera, **af)
                ConnectivitySpec.objects.create(camera=camera, **conn)

        # --- Lenses ---
        for (l_mount, l_name, l_focal, l_aperture, l_type, l_url) in LENSES:
            obj, created = Lens.objects.get_or_create(
                mount=l_mount, name=l_name,
                defaults=dict(
                    focal_length=l_focal, max_aperture=l_aperture,
                    lens_type=l_type, official_url=l_url, is_popular=True,
                ),
            )
            self.stdout.write(f"  {'Created' if created else 'Exists'} lens: {obj.name}")

        # --- Users ---
        user_map = {}
        for u in USERS:
            obj, created = User.objects.get_or_create(
                username=u["username"],
                defaults={"email": u["email"]},
            )
            if created:
                obj.set_password(u["password"])
                obj.save()
            user_map[u["username"]] = obj
            self.stdout.write(f"  {'Created' if created else 'Exists'} user: {obj.username}")

        # --- Reviews ---
        for (username, cam_model, title, body_text, pros, cons,
             (r_overall, r_photo, r_video, r_value), usage, exp, ownership) in REVIEWS:

            camera = camera_map.get(cam_model)
            author = user_map.get(username)
            if not camera or not author:
                continue

            _, created = Review.objects.get_or_create(
                camera=camera, author=author,
                defaults=dict(
                    title=title, body=body_text, pros=pros, cons=cons,
                    rating_overall=r_overall, rating_photo=r_photo,
                    rating_video=r_video, rating_value=r_value,
                    usage_type=usage, experience_level=exp,
                    ownership_status=ownership, is_published=True,
                ),
            )
            self.stdout.write(f"  {'Created' if created else 'Exists'} review by {username} on {cam_model}")

        self.stdout.write(self.style.SUCCESS("\nSeed complete!"))
