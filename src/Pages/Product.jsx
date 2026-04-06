import { useState, useCallback, useEffect } from "react";
import BaseTable from "../Components/Base/Table";
import BaseButton from "../Components/Base/Button";
import BaseDialog from "../Components/Base/Dialog";
import BaseInput from "../Components/Base/Input";
import { useFormik } from "formik";
import { getPlaceholder, handleImageError } from "../utils/common";
import { commonLabel } from "../utils/label";
import DialogFooter from "../Components/DialogFooter";
import { BASE_FILE_URL } from "../Api/apiService";
import defaultImage from "../assets/images/nope-not-here.avif";
import {
  listOfProducts,
  viewProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../Api/Product";
import { categoryDropdown, fileUpload } from "../Api/Category";
import BaseSelect from "../Components/Base/Select";
import { errorHandler } from "../utils/common";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { showErrorToast, showSuccessToast } from "../utils/toastService";
import { productValidationSchema } from "../utils/validationSchema";

const Product = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [addEditLoading, setAddEditLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    page: 1,
    pageSize: 10,
    sortKey: "id",
    sortValue: "desc",
    search: "",
  });
  const [products, SetProducts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const formik = useFormik({
    initialValues: {
      id: null,
      name: "",
      category_id: null,
      product_variants: [
        {
          product_title_name: "",
          description: "",
          color: "",
          size: "",
          price: 0,
          quantity: 0,
          variant_image: {
            image_path: "",
            preview: null,
          },
        },
      ],
    },
    validationSchema: productValidationSchema,
    onSubmit: async (values) => {
      try {
        setAddEditLoading(true);
        const payload = {
          name: values.name,
          category_id: values.category_id,
          product_variants: values.product_variants.map((v) => {
            const variant = {
              product_title_name: v.product_title_name,
              description: v.description,
              color: v.color,
              size: v.size,
              price: Number(v.price),
              quantity: Number(v.quantity),
            };

            if (v.variant_image?.image_path) {
              variant.variant_image = {
                image_path: v.variant_image.image_path,
              };
            }

            return variant;
          }),
        };

        let res;
        if (isEdit) {
          res = await updateProduct(values.id, payload);
        } else {
          res = await addProduct(payload);
        }

        if (res.success) {
          showSuccessToast(res.message);
          setVisible(false);
          fetchProducts();
        } else {
          showErrorToast(res.message);
        }
      } catch (error) {
        errorHandler(error);
      } finally {
        setAddEditLoading(false);
      }
    },
  });

  const addVariant = () => {
    const newVariant = {
      product_title_name: "",
      description: "",
      color: "",
      size: "",
      price: 0,
      quantity: 0,
      variant_image: {
        image_path: "",
        preview: null,
      },
    };
    formik.setFieldValue("product_variants", [
      ...formik.values.product_variants,
      newVariant,
    ]);
  };

  const removeVariant = (index) => {
    const updatedVariants = formik.values.product_variants.filter(
      (_, i) => i !== index,
    );
    formik.setFieldValue("product_variants", updatedVariants);
  };

  const handleVariantImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("files", file);
        const res = await fileUpload(formData);
        if (res.success) {
          formik.setFieldValue(`product_variants[${index}].variant_image`, {
            image_path: res.data[0],
            preview: URL.createObjectURL(file),
          });
        } else {
          showErrorToast(res.message);
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const removeVariantImage = (index) => {
    formik.setFieldValue(`product_variants[${index}].variant_image`, {
      image_path: "",
      preview: null,
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryDropdown();
      if (res.success) {
        setCategories(
          res.data.map((c) => ({
            label: c.category_name,
            value: c.id,
          })),
        );
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onImageError = (event) => {
    handleImageError(event, defaultImage);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const payload = {
        pageSize: tableParams.pageSize,
        page: tableParams.page,
        sortKey: tableParams.sortKey,
        sortValue: tableParams.sortValue,
        search: tableParams.search,
      };

      const response = await listOfProducts(payload);
      if (response.success) {
        SetProducts(response.data?.products || []);
        setTotalRecords(response.data?.totalItems || 0);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [
    tableParams.page,
    tableParams.pageSize,
    tableParams.sortKey,
    tableParams.sortValue,
    tableParams.search,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = async (rowData) => {
    try {
      setLoading(true);
      const res = await viewProduct(rowData.id);
      if (res.success) {
        const product = res.data;
        formik.setValues({
          id: product.id,
          name: product.name,
          category_id: product.category?.id,
          product_variants: product.variants.map((v) => ({
            product_title_name: v.product_title_name,
            description: v.description,
            color: v.color,
            size: v.size,
            price: v.price,
            quantity: v.quantity,
            variant_image: {
              image_path: v.image?.image_path,
              preview: v.image?.image_path
                ? `${BASE_FILE_URL}${v.image.image_path}`
                : null,
            },
          })),
        });
        setIsEdit(true);
        setVisible(true);
      } else {
        showErrorToast(res.message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (rowData) => {
    try {
      setLoading(true);
      const res = await viewProduct(rowData.id);
      if (res.success) {
        setSelectedProduct(res.data);
        setViewVisible(true);
      } else {
        showErrorToast(res.message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.name}"?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          const res = await deleteProduct(rowData.id);
          if (res.success) {
            showSuccessToast(res.message);
            fetchProducts();
          } else {
            showErrorToast(res.message);
          }
        } catch (error) {
          errorHandler(error);
        }
      },
    });
  };

  const columns = [
    {
      field: "image",
      header: commonLabel.image,
      body: (rowData) => {
        const variant = rowData.variants?.[0];
        const imageUrl = variant?.image?.image_path
          ? `${BASE_FILE_URL}${variant.image.image_path}`
          : defaultImage;
        return (
          <div className="relative group p-1 w-fit bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-blue-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={rowData.name}
              className="w-12 h-12 object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-110"
              onError={onImageError}
            />
          </div>
        );
      },
    },
    {
      field: "name",
      header: commonLabel.productName,
      body: (rowData) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
            {rowData.name}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {rowData.variants?.[0]?.product_title_name || "Main Product"}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      field: "category.category_name",
      header: commonLabel.categoryName,
      body: (rowData) => (
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">
          {rowData.category?.category_name || "Uncategorized"}
        </span>
      ),
    },
    {
      field: "price",
      header: commonLabel.price,
      body: (rowData) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-black text-sm">
            ₹{rowData.variants?.[0]?.price?.toLocaleString() || "0"}
          </span>
          {rowData.variants?.length > 1 && (
            <span className="text-[9px] text-gray-400 font-bold text-nowrap">
              +{rowData.variants.length - 1} more variants
            </span>
          )}
        </div>
      ),
    },
    {
      field: "createdAt",
      header: commonLabel.addedOn,
      body: (rowData) => (
        <div className="flex items-center gap-2 text-gray-500">
          <i className="pi pi-calendar text-[10px]"></i>
          <span className="text-xs font-semibold">
            {new Date(rowData.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
  ];

  const onPage = (event) => {
    const newPage = event.page + 1;
    const newPageSize = event.rows;
    if (newPage !== tableParams.page || newPageSize !== tableParams.pageSize) {
      setTableParams((prev) => ({
        ...prev,
        page: newPage,
        pageSize: newPageSize,
      }));
    }
  };

  const onSort = (event) => {
    const newSortKey = event.sortField || "id";
    const newSortValue = event.sortOrder === 1 ? "asc" : "desc";
    if (
      newSortKey !== tableParams.sortKey ||
      newSortValue !== tableParams.sortValue
    ) {
      setTableParams((prev) => ({
        ...prev,
        sortKey: newSortKey,
        sortValue: newSortValue,
      }));
    }
  };

  const onSearch = (value) => {
    if (value !== tableParams.search) {
      setTableParams((prev) => ({
        ...prev,
        search: value,
        page: 1,
      }));
    }
  };

  const handleAdd = () => {
    setIsEdit(false);
    formik.resetForm();
    setVisible(true);
  };

  const onHide = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8 max-w-(--breakpoint-2xl) mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 px-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">
                {commonLabel.inventory}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {totalRecords} {commonLabel.totalProducts}
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              {commonLabel.productCatalog}
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-2 max-w-md leading-relaxed">
              {commonLabel.organizationManageText}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {commonLabel.status}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-[1px]">
                  {commonLabel.liveUpdate}
                </span>
              </div>
            </div>
            <BaseButton
              label={commonLabel.addProduct}
              icon="pi pi-plus"
              className="w-auto! bg-gray-900 border-none shadow-xl shadow-gray-200 hover:bg-blue-600 transition-all duration-500 px-8 py-4 rounded-2xl text-sm font-bold text-white hover:scale-105 transform active:scale-95 group"
              onClick={handleAdd}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="relative group/table">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover/table:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.2rem] border border-gray-100/50 shadow-2xl shadow-gray-200/50 overflow-hidden">
            <BaseTable
              data={products}
              columns={columns}
              loading={loading}
              showActions={true}
              totalRecords={totalRecords}
              rows={tableParams.pageSize}
              first={(tableParams.page - 1) * tableParams.pageSize}
              sortField={tableParams.sortKey}
              sortOrder={tableParams.sortValue === "asc" ? 1 : -1}
              onPage={onPage}
              onSort={onSort}
              onSearch={onSearch}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              scrollHeight="calc(100vh - 380px)"
              tableClassName="product-table"
              title="Product Inventory"
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog Skeleton */}
      <BaseDialog
        visible={visible}
        header={
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {isEdit ? "Update Product" : "Create Product"}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {commonLabel.addProductMsg}
              </p>
            </div>
          </div>
        }
        closable={!addEditLoading}
        onHide={onHide}
        footer={
          <DialogFooter
            onHide={onHide}
            handleSave={formik.handleSubmit}
            loading={addEditLoading}
            buttonLabel={
              isEdit ? commonLabel.updateProduct : commonLabel.addProduct
            }
            disabled={addEditLoading}
          />
        }
        className="product-dialog max-w-4xl"
      >
        <div className="py-2 overflow-y-auto pr-2 custom-scrollbar">
          {/* Main Info Section */}
          <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 mb-5">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm">
                01
              </span>
              {commonLabel.generalInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                label={commonLabel.productName}
                name="name"
                placeholder={getPlaceholder(commonLabel.productName)}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.name && !!formik.errors.name}
                errormessage={formik.touched.name && formik.errors.name}
              />
              <BaseSelect
                label={commonLabel.categoryName}
                options={categories}
                name="category_id"
                optionValue="value"
                value={formik.values.category_id}
                onChange={(e) => {
                  formik.setFieldValue("category_id", e.value);
                  formik.setFieldTouched("category_id", true);
                }}
                placeholder={getPlaceholder(commonLabel.categoryName, "select")}
                onBlur={formik.handleBlur}
                required
                error={
                  formik.touched.category_id && !!formik.errors.category_id
                }
                errormessage={
                  formik.touched.category_id && formik.errors.category_id
                }
              />
            </div>
          </div>

          {/* Variants Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm">
                  02
                </span>
                {commonLabel.productVariants}
              </h3>
              <BaseButton
                label="Add Variant"
                icon="pi pi-plus-circle"
                type="button"
                className="w-auto! bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl font-bold text-xs"
                onClick={addVariant}
              />
            </div>

            <div className="flex flex-col gap-6 p-2">
              {formik.values.product_variants.map((variant, index) => (
                <div
                  key={index}
                  className="group/variant relative bg-white border border-gray-100 rounded-4xl p-4 transition-all hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 animate-in fade-in zoom-in-95 duration-500"
                >
                  {/* Remove Button */}
                  {formik.values.product_variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                    >
                      <i className="pi pi-trash font-bold"></i>
                    </button>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Image Upload Area */}
                    <div className="lg:col-span-3">
                      <div className="flex flex-col gap-3 h-full">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                          {commonLabel.variantImage}
                        </label>
                        <div
                          className="relative h-full min-h-[160px] rounded-3xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden group/img"
                          onClick={() =>
                            document
                              .getElementById(`variant-img-${index}`)
                              .click()
                          }
                        >
                          <input
                            type="file"
                            id={`variant-img-${index}`}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleVariantImageChange(e, index)}
                          />
                          {variant.variant_image.preview ? (
                            <>
                              <img
                                src={variant.variant_image.preview}
                                className="w-full h-full object-cover"
                                alt="Preview"
                                onError={onImageError}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex gap-2">
                                  <div
                                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl text-white flex items-center justify-center hover:bg-white/40 transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      document
                                        .getElementById(`variant-img-${index}`)
                                        .click();
                                    }}
                                  >
                                    <i className="pi pi-refresh"></i>
                                  </div>
                                  <div
                                    className="w-10 h-10 bg-red-500/80 backdrop-blur-md rounded-xl text-white flex items-center justify-center hover:bg-red-600 transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeVariantImage(index);
                                    }}
                                  >
                                    <i className="pi pi-trash"></i>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover/img:bg-blue-100 group-hover/img:text-blue-500 transition-all">
                                <i className="pi pi-image text-xl"></i>
                              </div>
                              <p className="text-[10px] text-center font-bold text-gray-400 uppercase">
                                {commonLabel.uploadImage}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Fields Area */}
                    <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <BaseInput
                          label={commonLabel.variantTitle}
                          name={`product_variants[${index}].product_title_name`}
                          placeholder={getPlaceholder(commonLabel.variantTitle)}
                          value={variant.product_title_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          required
                          error={
                            formik.touched.product_variants?.[index]
                              ?.product_title_name &&
                            !!formik.errors.product_variants?.[index]
                              ?.product_title_name
                          }
                          errormessage={
                            formik.touched.product_variants?.[index]
                              ?.product_title_name &&
                            formik.errors.product_variants?.[index]
                              ?.product_title_name
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <BaseInput
                          label={commonLabel.variantDescription}
                          name={`product_variants[${index}].description`}
                          placeholder={getPlaceholder(
                            commonLabel.variantDescription,
                          )}
                          value={variant.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          required
                          error={
                            formik.touched.product_variants?.[index]
                              ?.description &&
                            !!formik.errors.product_variants?.[index]
                              ?.description
                          }
                          errormessage={
                            formik.touched.product_variants?.[index]
                              ?.description &&
                            formik.errors.product_variants?.[index]?.description
                          }
                          type="textarea"
                          rows={2}
                        />
                      </div>
                      <BaseInput
                        label={commonLabel.color}
                        name={`product_variants[${index}].color`}
                        placeholder={getPlaceholder(commonLabel.color)}
                        value={variant.color}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                        error={
                          formik.touched.product_variants?.[index]?.color &&
                          !!formik.errors.product_variants?.[index]?.color
                        }
                        errormessage={
                          formik.touched.product_variants?.[index]?.color &&
                          formik.errors.product_variants?.[index]?.color
                        }
                      />
                      <BaseInput
                        label={commonLabel.size}
                        name={`product_variants[${index}].size`}
                        placeholder={getPlaceholder(commonLabel.size)}
                        value={variant.size}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                        error={
                          formik.touched.product_variants?.[index]?.size &&
                          !!formik.errors.product_variants?.[index]?.size
                        }
                        errormessage={
                          formik.touched.product_variants?.[index]?.size &&
                          formik.errors.product_variants?.[index]?.size
                        }
                      />
                      <BaseInput
                        label={commonLabel.qty}
                        name={`product_variants[${index}].quantity`}
                        type="text"
                        placeholder={getPlaceholder(commonLabel.qty)}
                        value={variant.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                        error={
                          formik.touched.product_variants?.[index]?.quantity &&
                          !!formik.errors.product_variants?.[index]?.quantity
                        }
                        errormessage={
                          formik.touched.product_variants?.[index]?.quantity &&
                          formik.errors.product_variants?.[index]?.quantity
                        }
                        digitOnly
                      />
                      <BaseInput
                        label={commonLabel.price}
                        name={`product_variants[${index}].price`}
                        type="text"
                        placeholder={getPlaceholder(commonLabel.price)}
                        inputClassName="text-lg font-black text-blue-600"
                        value={variant.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                        error={
                          formik.touched.product_variants?.[index]?.price &&
                          !!formik.errors.product_variants?.[index]?.price
                        }
                        errormessage={
                          formik.touched.product_variants?.[index]?.price &&
                          formik.errors.product_variants?.[index]?.price
                        }
                        digitOnly
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseDialog>

      {/* View Product Details Dialog */}
      <BaseDialog
        visible={viewVisible}
        onHide={() => setViewVisible(false)}
        header={
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <i className="pi pi-eye text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {commonLabel.productDetails}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {commonLabel.comprehensiveOverview}
              </p>
            </div>
          </div>
        }
        className="product-view-dialog max-w-5xl"
        contentClassName="p-0"
        closable={true}
      >
        {selectedProduct && (
          <div className="flex flex-col lg:flex-row h-[70vh]">
            {/* Left: Product Images Gallery (Conceptual for simple view) */}
            <div className="lg:w-2/5 bg-gray-50/50 p-8 border-r border-gray-100 flex items-center justify-center overflow-hidden">
              <div className="relative group w-full aspect-square bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 p-4 border border-gray-100 overflow-hidden">
                <img
                  src={
                    selectedProduct.variants?.[0]?.image?.image_path
                      ? `${BASE_FILE_URL}${selectedProduct.variants[0].image.image_path}`
                      : defaultImage
                  }
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-105"
                  onError={onImageError}
                />
              </div>
            </div>

            {/* Right: Detailed Information */}
            <div className="lg:w-3/5 p-8 overflow-y-auto custom-scrollbar">
              <div className="mb-8">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest mb-4 inline-block">
                  {selectedProduct.category?.category_name}
                </span>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase italic">
                  {selectedProduct.name}
                </h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
                  {commonLabel.id}: #{selectedProduct.id} • {commonLabel.added}:{" "}
                  {new Date(selectedProduct.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                  {commonLabel.variant}
                </h4>
                {selectedProduct.variants?.map((v, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-bold text-gray-800">
                          {v.product_title_name}
                        </h5>
                        <p className="text-xs text-gray-500 font-medium italic">
                          {v.description || "-"}
                        </p>
                      </div>
                      <span className="text-lg font-black text-blue-600">
                        ₹{v.price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                        Color:{" "}
                        {v.color ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                              style={{
                                backgroundColor: v.color.toLowerCase(),
                              }}
                            />{" "}
                            <span className="text-gray-700">{v.color}</span>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                        {commonLabel.size}: {v.size || "N/A"}
                      </div>
                      <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                        {commonLabel.stock}: {v.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </BaseDialog>

      <ConfirmDialog />
    </>
  );
};

export default Product;
