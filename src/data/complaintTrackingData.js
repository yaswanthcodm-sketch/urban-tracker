/**
 * @module complaintTrackingData
 * @description Master data and lifecycle models for all 5 road types covering every stage of complaint tracking.
 */

export const SAMPLE_COMPLAINTS = {
  // 1. CEMENT ROAD (CC ROAD) - Fully Resolved with Before & After Approval
  "RG-2026-CC-8492": {
    tracking_id: "RG-2026-CC-8492",
    road_type: "cement_road",
    road_type_name: "Cement Road (CC Road)",
    road_name: "Ward 14 Gandhi Nagar 2nd Cross CC Road, Nuzvid",
    locality: "Nuzvid, Krishna District, Andhra Pradesh",
    gps_coordinates: "16.7865° N, 80.8465° E",
    defect_type: "Concrete Spalling & Deep Pothole (Depth ~14cm)",
    severity: "CRITICAL",
    priority: "P1-URGENT",
    current_status: "RESOLVED",
    current_step: 6, // 1 to 6
    registered_at: "27 Oct 2026, 08:30 IST",
    source: "AI Satellite & Citizen Mobile Portal",
    
    // Authority Assignment
    department: {
      name: "Greater Municipal Corporation (Nuzvid Engineering Wing)",
      subdivision: "Urban Roads & Stormwater Division",
      jurisdiction: "Municipal Urban Ward 14",
      officer_in_charge: "Er. P. Satyanarayana, M.Tech (Executive Engineer)",
      officer_badge: "EE-MNC-4402",
      contact_helpline: "08656-235411 / +91 94923 23535",
      sla_hours: 48,
      assigned_at: "27 Oct 2026, 09:45 IST",
    },

    // Worker & Repair Crew Appointment
    contractor: {
      firm_name: "Sri Sai Civil Infrastructure & Concrete Works Ltd.",
      work_order_id: "WO-2026-CC-8492-NUV",
      lead_supervisor: "Rajesh Kumar (Junior Site Engineer)",
      supervisor_badge: "SE-CIVIL-8841",
      supervisor_phone: "+91 98481 44520",
      work_crew: "Rapid Pavement Patch Unit Gamma (4 Masons + 2 Compactors)",
      crew_vehicle_id: "AP-16-TX-9821 (Mobile Concrete Mixer Unit)",
      appointed_at: "27 Oct 2026, 11:20 IST",
    },

    // Repair Status
    repair: {
      status_label: "COMPLETED",
      started_at: "28 Oct 2026, 07:00 IST",
      completed_at: "28 Oct 2026, 15:30 IST",
      repair_method: "M30 Rapid-Hardening Cement Concrete with Polymer Bonding Agent",
      execution_log: [
        { time: "28 Oct 07:15 IST", text: "Site baricading and concrete cavity perimeter saw-cutting complete." },
        { time: "28 Oct 09:30 IST", text: "Debris removed and high-strength epoxy bonding primer applied." },
        { time: "28 Oct 12:45 IST", text: "M30 grade ready-mix concrete poured, vibrated, and screed-leveled." },
        { time: "28 Oct 15:30 IST", text: "Expansion joint sealant installed. Membrane curing compound sprayed." },
      ],
    },

    // Road Condition Review (Before vs After)
    review: {
      before_image: "/assets/images/tracking/cement_road_cc_before.jpg",
      after_image: "/assets/images/tracking/cement_road_cc_after.jpg",
      inspector_notes: "Deep concrete spalling fully restored with M30 grade concrete. Joint integrity and load-bearing capacity verified under 20-tonne roller test.",
      smoothness_score: "96.4% (Grade A - Flawless Rigid Pavement)",
      inspected_by: "Dr. K. V. Raman, Quality Control Auditor (R&B)",
      reviewed_at: "29 Oct 2026, 10:15 IST",
    },

    // Final Approval
    approval: {
      status: "APPROVED & CLOSED",
      approved_by: "Municipal Commissioner, Nuzvid Municipal Council",
      digital_certificate_id: "GOI-MORTH-AP-2026-98442",
      citizen_feedback: "5.0 / 5.0 (Excellent prompt concrete repair)",
      resolved_at: "29 Oct 2026, 16:00 IST",
    },
  },

  // 2. VILLAGE & LOCAL STREET - Repair In Progress
  "RG-2026-VG-5120": {
    tracking_id: "RG-2026-VG-5120",
    road_type: "village_street",
    road_type_name: "Village & Local Street (Gram Panchayat)",
    road_name: "Gollapalli Gram Panchayat Main Village Street",
    locality: "Gollapalli Village, Nuzvid Mandal",
    gps_coordinates: "16.7810° N, 80.8540° E",
    defect_type: "Road Shoulder Collapse & Waterlogged Pothole",
    severity: "HIGH",
    priority: "P2-HIGH",
    current_status: "REPAIR_IN_PROGRESS",
    current_step: 4, // In Progress
    registered_at: "29 Oct 2026, 10:15 IST",
    source: "Citizen Grievance via Gram Panchayat Secretary",

    department: {
      name: "Panchayat Raj Engineering Department (PRED)",
      subdivision: "Rural Roads Division (Mandal Office)",
      jurisdiction: "Gollapalli Gram Panchayat",
      officer_in_charge: "Er. Ramesh Babu (Assistant Executive Engineer, PRED)",
      officer_badge: "AEE-PRED-1029",
      contact_helpline: "08656-248100",
      sla_hours: 72,
      assigned_at: "29 Oct 2026, 12:00 IST",
    },

    contractor: {
      firm_name: "Krishna District Rural Roadworks & Infra",
      work_order_id: "WO-2026-VG-5120-PR",
      lead_supervisor: "M. Venkateswara Rao",
      supervisor_badge: "RW-RUR-502",
      supervisor_phone: "+91 94401 22819",
      work_crew: "Gram Sadak Repair Team (5 Workers + 1 Mini Roller)",
      crew_vehicle_id: "AP-16-TY-4421",
      appointed_at: "29 Oct 2026, 16:00 IST",
    },

    repair: {
      status_label: "IN_PROGRESS",
      started_at: "30 Oct 2026, 08:30 IST",
      completed_at: null,
      repair_method: "Granular Sub-Base Rebuilding & Bituminous Macadam Patching",
      execution_log: [
        { time: "30 Oct 08:30 IST", text: "Drainage runoff channel cleared to prevent water stagnation." },
        { time: "30 Oct 11:00 IST", text: "Crushed stone aggregate base compacted using 8-ton vibratory roller." },
        { time: "30 Oct 14:15 IST", text: "Bitumen emulsion prime coat sprayed; hot mix laying currently underway." },
      ],
    },

    review: {
      before_image: "/assets/images/tracking/village_street_before.jpg",
      after_image: "/assets/images/tracking/village_street_after.jpg",
      inspector_notes: "Interim inspection: Base compaction complete; surface laying nearing completion.",
      smoothness_score: "Pending Final Roll (Expected ~92%)",
      inspected_by: "Panchayat Raj Quality Wing",
      reviewed_at: null,
    },

    approval: {
      status: "PENDING_COMPLETION",
      approved_by: "Pending Site Clearance",
      digital_certificate_id: "PENDING",
      citizen_feedback: "Pending",
      resolved_at: null,
    },
  },

  // 3. CITY ROAD - Worker & Repair Crew Appointed
  "RG-2026-CT-3391": {
    tracking_id: "RG-2026-CT-3391",
    road_type: "city_road",
    road_type_name: "City Road (Municipal Corporation)",
    road_name: "Besant Road Commercial Market Avenue, Vijayawada",
    locality: "Ward 22, Vijayawada Municipal Corporation (VMC)",
    gps_coordinates: "16.5100° N, 80.6280° E",
    defect_type: "Deep Cavity Pothole near Pedestrian Crossing (~16cm)",
    severity: "HIGH",
    priority: "P2-HIGH",
    current_status: "WORKER_APPOINTED",
    current_step: 3, // Worker appointed
    registered_at: "30 Oct 2026, 14:00 IST",
    source: "Smart City AI CCTV Surveillance Camera #VMC-CAM-04",

    department: {
      name: "Vijayawada Municipal Corporation (VMC)",
      subdivision: "Circle II Engineering & Maintenance Wing",
      jurisdiction: "Governorpet & Besant Road Commercial Zone",
      officer_in_charge: "Er. K. Suresh Kumar (Superintending Engineer)",
      officer_badge: "SE-VMC-319",
      contact_helpline: "0866-2422400 / Toll Free 103",
      sla_hours: 36,
      assigned_at: "30 Oct 2026, 15:30 IST",
    },

    contractor: {
      firm_name: "Andhra Urban Asphalt & Paving Syndicate",
      work_order_id: "WO-2026-CT-3391-VMC",
      lead_supervisor: "K. Balaram (City Pavement Inspector)",
      supervisor_badge: "INS-VMC-701",
      supervisor_phone: "+91 99890 11234",
      work_crew: "VMC Quick-Action Night Patch Squad (6 Workers)",
      crew_vehicle_id: "AP-16-Z-1088 (Thermal Bitumen Patching Truck)",
      appointed_at: "31 Oct 2026, 09:00 IST",
    },

    repair: {
      status_label: "PENDING_DISPATCH",
      started_at: "Scheduled tonight at 22:00 IST (Off-peak traffic)",
      completed_at: null,
      repair_method: "Dense Bituminous Concrete (DBC) Hot-Mix Thermal Patching",
      execution_log: [
        { time: "31 Oct 09:30 IST", text: "Materials dispatched from batching plant; night traffic diversion permit approved." },
      ],
    },

    review: {
      before_image: "/assets/images/tracking/city_road_before.jpg",
      after_image: "/assets/images/tracking/city_road_after.jpg",
      inspector_notes: "Before evidence verified by AI vision (96.2% confidence). Night execution ordered to prevent daytime market congestion.",
      smoothness_score: "Target: 95.0%",
      inspected_by: "VMC Urban Surveyor",
      reviewed_at: null,
    },

    approval: {
      status: "IN_PROGRESS_PIPELINE",
      approved_by: "Pending Execution",
      digital_certificate_id: "PENDING",
      citizen_feedback: "Pending",
      resolved_at: null,
    },
  },

  // 4. MAIN ARTERIAL ROAD - Authority Assigned
  "RG-2026-MR-7744": {
    tracking_id: "RG-2026-MR-7744",
    road_type: "main_road",
    road_type_name: "Main Road (Major District Road MDR)",
    road_name: "Clock Tower Junction Arterial Corridor, Nuzvid",
    locality: "Old Bus Stand Axis, Nuzvid Town",
    gps_coordinates: "16.7875° N, 80.8460° E",
    defect_type: "Severe Transverse Cracks & Bitumen Surface Fatigue",
    severity: "MEDIUM",
    priority: "P3-NORMAL",
    current_status: "AUTHORITY_ASSIGNED",
    current_step: 2, // Authority assigned
    registered_at: "31 Oct 2026, 11:30 IST",
    source: "Citizen Report via RoadGuard Mobile Web App",

    department: {
      name: "Andhra Pradesh State Roads & Buildings (R&B)",
      subdivision: "Eluru-Nuzvid Highway Division",
      jurisdiction: "MDR-14 Corridor",
      officer_in_charge: "Er. N. Chandrasekhar (Executive Engineer, R&B)",
      officer_badge: "EE-RNB-2201",
      contact_helpline: "08812-230555",
      sla_hours: 48,
      assigned_at: "31 Oct 2026, 13:15 IST",
    },

    contractor: {
      firm_name: "Pending Tender Assignment / Framework Contractor Callout",
      work_order_id: "WO-PENDING-TENDER",
      lead_supervisor: "Assistant Engineer (R&B Section Office)",
      supervisor_badge: "AE-RNB-14",
      supervisor_phone: "TBD",
      work_crew: "Framework Maintenance Team (TBD)",
      crew_vehicle_id: "TBD",
      appointed_at: "Estimates submitted for contractor sanction",
    },

    repair: {
      status_label: "AWAITING_WORKER_DISPATCH",
      started_at: "Scheduled tomorrow at 08:00 IST",
      completed_at: null,
      repair_method: "Milling 40mm Top Course & Laying Dense Bituminous Macadam",
      execution_log: [
        { time: "31 Oct 13:15 IST", text: "Complaint acknowledged by R&B Division Engineer. Estimates created." },
      ],
    },

    review: {
      before_image: "/assets/images/tracking/main_road_before.jpg",
      after_image: "/assets/images/tracking/main_road_after.jpg",
      inspector_notes: "Before distress captured by citizen photo and confirmed by high-res satellite pass.",
      smoothness_score: "Baseline: 72% -> Expected: 94%",
      inspected_by: "R&B Field Surveyor",
      reviewed_at: null,
    },

    approval: {
      status: "PIPELINE_ASSIGNED",
      approved_by: "Pending Repair",
      digital_certificate_id: "PENDING",
      citizen_feedback: "Pending",
      resolved_at: null,
    },
  },

  // 5. NATIONAL HIGHWAY - Registered & Token Generated
  "RG-2026-HW-1092": {
    tracking_id: "RG-2026-HW-1092",
    road_type: "highway",
    road_type_name: "National Highway (NHAI Expressway)",
    road_name: "NH-16 Kolkata-Chennai Highway Corridor (KM 42.4)",
    locality: "Between Vijayawada & Guntur Bypass Corridor",
    gps_coordinates: "16.5350° N, 80.6650° E",
    defect_type: "High-Speed Asphalt Pothole Cavity on Fast Lane (~18cm)",
    severity: "CRITICAL",
    priority: "P1-CRITICAL",
    current_status: "REGISTERED",
    current_step: 1, // Just registered
    registered_at: "31 Oct 2026, 17:45 IST",
    source: "High-Definition Highway Patrol AI Surveillance Vehicle",

    department: {
      name: "National Highways Authority of India (NHAI)",
      subdivision: "Project Implementation Unit (PIU) Vijayawada",
      jurisdiction: "NH-16 Six-Lane Golden Quadrilateral Section",
      officer_in_charge: "Project Director, NHAI PIU Vijayawada",
      officer_badge: "NHAI-PIU-VJA-01",
      contact_helpline: "1033 (National Highway Emergency Helpline)",
      sla_hours: 24,
      assigned_at: "Processing automated routing to NHAI concessionaire...",
    },

    contractor: {
      firm_name: "Highway Concessionaire Incident Management System",
      work_order_id: "NH-EMERGENCY-DISPATCH-PENDING",
      lead_supervisor: "Highway Route Patrol Officer",
      supervisor_badge: "NH-PATROL-16",
      supervisor_phone: "1033",
      work_crew: "Emergency Concessionaire Highway Patrol Unit",
      crew_vehicle_id: "NHAI-PATROL-04",
      appointed_at: "Notification dispatched to Highway Concessionaire",
    },

    repair: {
      status_label: "REGISTRATION_COMPLETE",
      started_at: "Emergency crew en-route",
      completed_at: null,
      repair_method: "Emergency Cold Mix Asphalt Patch with Retroreflective Coning",
      execution_log: [
        { time: "31 Oct 17:45 IST", text: "Geotagged hazard detected. High-speed emergency warning flagged to 1033 control room." },
      ],
    },

    review: {
      before_image: "/assets/images/tracking/highway_nh_before.jpg",
      after_image: "/assets/images/tracking/highway_nh_after.jpg",
      inspector_notes: "Critical hazard registered on 90 km/h expressway speed zone. Mandatory 24h SLA triggered.",
      smoothness_score: "Critical Surface Hazard Alert",
      inspected_by: "AI Optical Sensor Suite",
      reviewed_at: null,
    },

    approval: {
      status: "REGISTRATION_LOGGED",
      approved_by: "Automated NHAI Grievance Gateway",
      digital_certificate_id: "NHAI-ALERT-1092",
      citizen_feedback: "Pending",
      resolved_at: null,
    },
  },
};

/**
 * Look up complaint by tracking ID (case-insensitive)
 */
export function getComplaintById(trackingId) {
  if (!trackingId) return null;
  const cleanId = String(trackingId).trim().toUpperCase();
  if (SAMPLE_COMPLAINTS[cleanId]) return SAMPLE_COMPLAINTS[cleanId];
  
  // Also match partial suffix if user enters without prefix
  for (const key of Object.keys(SAMPLE_COMPLAINTS)) {
    if (key.includes(cleanId) || cleanId.includes(key)) {
      return SAMPLE_COMPLAINTS[key];
    }
  }

  // Fallback dynamic object for unknown tracking numbers
  return {
    tracking_id: cleanId,
    road_type: "cement_road",
    road_type_name: "Cement Road (CC Road)",
    road_name: `Grievance Location · ${cleanId}`,
    locality: "Active Municipal Jurisdiction, India",
    gps_coordinates: "16.7865° N, 80.8465° E",
    defect_type: "Reported Road Distress & Pothole",
    severity: "HIGH",
    priority: "P2-HIGH",
    current_status: "REGISTERED",
    current_step: 1,
    registered_at: new Date().toLocaleDateString('en-GB') + " (Just now)",
    source: "Citizen Web Portal Grievance",
    department: {
      name: "Municipal Engineering & Roadworks Department",
      subdivision: "Local Ward Engineering Sub-Division",
      jurisdiction: "Active Local Authority",
      officer_in_charge: "Jurisdictional Municipal Engineer",
      officer_badge: "ENG-OFFICIAL-2026",
      contact_helpline: "1800-ROAD-AID (Toll Free)",
      sla_hours: 48,
      assigned_at: "Auto-assigned by RoadGuard AI Routing",
    },
    contractor: {
      firm_name: "Municipal Quick-Response Repair Crew",
      work_order_id: `WO-${cleanId}`,
      lead_supervisor: "Municipal Pavement Supervisor",
      supervisor_badge: "SUP-ACTIVE-01",
      supervisor_phone: "+91 94923 23535",
      work_crew: "Road Inspection & Patch Unit (4 Workers)",
      crew_vehicle_id: "CIVIC-MAINT-01",
      appointed_at: "Dispatched upon verification",
    },
    repair: {
      status_label: "AWAITING_SCHEDULE",
      started_at: "Scheduled within SLA window",
      completed_at: null,
      repair_method: "Pavement excavation and ready-mix patching",
      execution_log: [
        { time: "Today", text: "Grievance received and verified by RoadGuard AI automated telemetry." },
      ],
    },
    review: {
      before_image: "/assets/images/tracking/cement_road_cc_before.jpg",
      after_image: "/assets/images/tracking/cement_road_cc_after.jpg",
      inspector_notes: "Grievance registered. Quality review will activate upon repair completion.",
      smoothness_score: "Pending Repair",
      inspected_by: "Civic Engineering Quality Inspector",
      reviewed_at: null,
    },
    approval: {
      status: "PROCESSING",
      approved_by: "Pending Resolution",
      digital_certificate_id: "PENDING",
      citizen_feedback: "Pending",
      resolved_at: null,
    },
  };
}
